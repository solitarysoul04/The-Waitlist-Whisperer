from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Initializing API
app = FastAPI(title = "The Waitlist Whisperer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["https://solitarysoul04-waitlist-whisperer.vercel.app"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],   
    )

# Data Structure
class TicketRequest(BaseModel):
    waitlist_position: int
    days_left: int
    coach_class: str
    seasonality: str

@app.post("/predict")
def calculate_odds(ticket:TicketRequest):
    # 1. Base Calc - start with base of 100%, subtract points for long waitlist, add points if more days left for departur)
    probability = 100 - (ticket.waitlist_position * 1.5) + (ticket.days_left * 0.8)

    # 2. Coach Class Adjustment - Premium class have fewer seats and fewer cancellations.
    class_modifiers = {
        "Sleeper":10, # More seats, more chances of moving up
        "3 AC":0,
        "2 AC":-15,
        "1 AC":-30
    }
    probability += class_modifiers.get(ticket.coach_class, 0)

    # 3. Seasonality Adjustment - During peak season, festivals nobody cancels and hence less chance of moving up
    if ticket.seasonality == "Peak Festival Rush":
        probability -=35
    elif ticket.seasonality == "Low Demand":
        probability += 15

    # 4. Enforcing limits (b/w 1% and 99%)
    final_prob = max(1.0, min(99.0, probability))

    # 5. Determining Risk Tier
    if final_prob >= 75:
        tier = "Safe Zone"
    elif final_prob >= 40:
        tier = "Moderate Risk"
    else:
        tier = "High Risk - Seek Alternatives"

    return{
        "calculated_probability": round (final_prob, 1),
        "risk_tier": tier,
        "message": "Prediction calculated successfully. It's based on historical data and may not reflect real-time changes in waitlist dynamics."
    }

# Running locally for trial purposes
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
