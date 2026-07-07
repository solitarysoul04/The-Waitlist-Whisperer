from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

# Initializing API
app = FastAPI(title = "The Waitlist Whisperer API")

# Data Structure
class TicketRequest(BaseModel):
    waitlist_position: int
    days_left: int
    coach_class: str
    seasonality: str

@app.post("/api/predict")
def calculate_odds(ticket: TicketRequest):
    try:
        # 1. Base Calc - start with base of 100%, subtract points for long waitlist, add points if more days left for departure)
        probability = 100 - (ticket.waitlist_position * 1.5) + (ticket.days_left * 0.8)

        class_modifiers = {
            "Sleeper": 10,
            "3AC": 0,
            "2AC": -15,
            "1AC": -30
        }
        probability += class_modifiers.get(ticket.coach_class, 0)

        if ticket.seasonality == "Peak Festival Rush":
            probability -= 35
        elif ticket.seasonality == "Low Demand":
            probability += 15

        final_prob = max(1.0, min(99.0, probability))

        if final_prob >= 75:
            tier = "Safe Zone"
        elif final_prob >= 40:
            tier = "Moderate Risk"
        else:
            tier = "High Risk - Seek Alternatives"

        trend_data = []

        daily_clearance = 2.5 if ticket.coach_class == "Sleeper" else 1.2
        if ticket.seasonality == "Peak Festival Rush":
            daily_clearance *= 0.3
        elif ticket.seasonality == "Low Demand":
            daily_clearance *= 1.8

        for day in range(ticket.days_left, -1, -1):
            days_passed = ticket.days_left - day
            projected_pos = max(0, int(ticket.waitlist_position - (days_passed * daily_clearance)))

            trend_data.append({
                "days_remaining": day,
                "projected_position": projected_pos
            })

        return {
            "calculated_probability": round(final_prob, 1),
            "risk_tier": tier,
            "projected_trend": trend_data,
            "message": "Prediction calculated successfully. It's based on historical data and may not reflect real-time changes in waitlist dynamics."
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your prediction request."
        )