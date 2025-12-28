import re
from pypdf import PdfReader
from io import BytesIO
from typing import Dict, List, Any

def extract_text_from_pdf(file_content: bytes) -> str:
    """Reads PDF content and returns extracted text."""
    reader = PdfReader(BytesIO(file_content))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def parse_opinion_text(text: str) -> Dict[str, List[Any]]:
    """
    Heuristically parses the text to find Requirements and Tracts.
    Returns a dictionary with 'requirements' and 'tracts'.
    """

    extracted = {
        "tracts": [],
        "requirements": []
    }

    # 1. Extract Tracts
    # Heuristic: Look for "Tract <number>:" or "TRACT <number>" followed by text until next Tract or Section
    # This is a simplified regex.
    tract_pattern = re.compile(r"(?:TRACT|Tract)\s+(\d+)\s*[:\-\n](.*?)(?=(?:TRACT|Tract)\s+\d+|REQUIREMENT|Requirement|Title Opinion|$)", re.DOTALL | re.IGNORECASE)

    for match in tract_pattern.finditer(text):
        tract_num = match.group(1)
        description = match.group(2).strip()
        extracted["tracts"].append({
            "description": f"Tract {tract_num}: {description[:200]}..." # Truncate for summary
        })

    # 2. Extract Requirements
    # Heuristic: Look for "Requirement <number>" or "Requirement No. <number>"
    # Also look for keywords "FATAL" or "ADVISORY" nearby or in the text.

    # Improved regex to handle "Requirement No. 1" and "Requirement 1" better, and end capture properly
    # Fix: Ensure "Tract" in lookahead requires a number so we don't match "abstract"
    req_pattern = re.compile(r"(?:REQUIREMENT|Requirement)(?:\s+No\.|s)?\s*(\d+)\s*[:\-\n]?(.*?)(?=(?:REQUIREMENT|Requirement)(?:\s+No\.|s)?\s*\d+|(?:TRACT|Tract)\s+\d+|Title Opinion|$)", re.DOTALL | re.IGNORECASE)

    for match in req_pattern.finditer(text):
        req_num = match.group(1)
        content = match.group(2).strip()

        # Debugging: Print content length to see if we are capturing enough text
        print(f"DEBUG: Req {req_num} Content: {content!r} contains FATAL? {'FATAL' in content.upper()}")

        severity = "ADVISORY" # Default
        if "FATAL" in content.upper() or "SUSPEND" in content.upper():
            severity = "FATAL"

        extracted["requirements"].append({
            "description": f"Requirement {req_num}: {content[:300]}...",
            "severity": severity,
            "full_text": content # We might store this or just description
        })

    return extracted
