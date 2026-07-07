import os
from pptx import Presentation
import pandas as pd
from reportlab.pdfgen import canvas

def verify():
    # Check existence
    files = [
        "SportsQuiz2026.pptx",
        "AnswerKey.pdf",
        "QuizMasterNotes.pdf",
        "ScoreSheet.xlsx",
        "Questions.json",
        "FinalReport.md"
    ]
    for f in files:
        if os.path.exists(f):
            print(f"PASS: {f} exists. Size: {os.path.getsize(f)} bytes")
        else:
            print(f"FAIL: {f} missing")

    # Verify PPTX
    try:
        prs = Presentation("SportsQuiz2026.pptx")
        print(f"PASS: SportsQuiz2026.pptx is a valid PowerPoint file with {len(prs.slides)} slides.")
    except Exception as e:
        print(f"FAIL: SportsQuiz2026.pptx verification failed: {e}")

    # Verify Excel
    try:
        df = pd.read_excel("ScoreSheet.xlsx")
        print(f"PASS: ScoreSheet.xlsx is a valid Excel file with columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"FAIL: ScoreSheet.xlsx verification failed: {e}")

if __name__ == "__main__":
    verify()
