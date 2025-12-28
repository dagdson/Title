from backend.extractor import parse_opinion_text

sample_text = """
LANDRE ENERGY OPERATING, LLC

ORIGINAL TITLE OPINION

TRACT 1: All of Section 10, Township 15 North, Range 99 West, Containing 640 acres more or less.
Ownership is vested as follows: John Doe - 50%, Jane Doe - 50%.

REQUIREMENT NO. 1
The instruments in the abstract indicate a break in the chain of title for John Doe.
This is a FATAL defect. You must obtain a curative deed.

REQUIREMENT NO. 2
We note that the lease for Jane Doe is nearing expiration.
This is ADVISORY. Please monitor the primary term.

TRACT 2: The NE/4 of Section 11.
Ownership is clear.

REQUIREMENT 3
Unreleased mortgage on Tract 2. Please obtain release.
"""

def test_extraction():
    print("Testing extraction logic...")
    result = parse_opinion_text(sample_text)

    # Check Tracts
    assert len(result["tracts"]) == 2, f"Expected 2 tracts, got {len(result['tracts'])}"
    print(f"Tracts extracted: {len(result['tracts'])}")

    # Check Requirements
    print("DEBUG: Extracted Requirements:")
    for r in result["requirements"]:
        print(f" - {r['description']} | Severity: {r['severity']}")

    assert len(result["requirements"]) == 3, f"Expected 3 requirements, got {len(result['requirements'])}"
    print(f"Requirements extracted: {len(result['requirements'])}")

    # Check Severity
    req1 = next(r for r in result["requirements"] if "Requirement 1" in r["description"])
    assert req1["severity"] == "FATAL", f"Requirement 1 should be FATAL, got {req1['severity']}"

    req2 = next(r for r in result["requirements"] if "Requirement 2" in r["description"])
    assert req2["severity"] == "ADVISORY", "Requirement 2 should be ADVISORY"

    print("Extraction logic verification passed!")

if __name__ == "__main__":
    test_extraction()
