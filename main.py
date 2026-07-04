from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Initializing API
app = FastAPI(title = "The Waitlist Whisperer API")

# Data Structure
class Ticketrequest(BaseModel):
    waitlist_position: int
    days_left: int
    coach_class: str
    seasonality: str

@app.post("/predict")
def calculate_odds(ticket:TicketRequest):
    # 1. Base Calc - start with base of 100%, subtract points for long waitlist, add points if more days left for departur)
    probability = 100 - (ticket.waitlist_position * 1.5) + (ticket.days_left * 0.8)

    # 2. Caoch Class Adjustment - Premium class have fewer seats aand fewer cancellations.
    class_modifiers