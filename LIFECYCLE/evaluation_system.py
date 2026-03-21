import random

from typing import Tuple

def evaluate_answer(question_text: str, answer_text: str, candidate_id: str, difficulty: int) -> Tuple[float, str]:
    """
    Simulates sending the answer to the GPT-4o-mini Evaluation layer.
    In the real implementation, this would make an API call to the LLM module
    to dynamically evaluate the correctness and context of the answer.
    """
    print(f"[LLM Evaluator] Evaluating answer by {candidate_id}...")
    print(f"Question (Diff: {difficulty}): {question_text}")
    print(f"Answer: {answer_text}")

    # Stub evaluation logic (0.0 to 10.0) based on answer length as a dummy metric
    if len(answer_text.strip()) == 0:
        return 0.0, "Empty answer provided."

    # Ideally we'd invoke GPT-4o-mini like:
    # prompt = f"Rate this answer for '{question_text}'...\nAnswer: {answer_text}"
    # response = openai.ChatCompletion.create(model="gpt-4o-mini", messages=[...])
    
    score = random.uniform(5.0, 9.8) if len(answer_text) > 10 else random.uniform(1.0, 4.0)
    feedback = "Good attempt with relevant points." if score >= 5.0 else "Answer lacks depth and accuracy."
    print(f"[LLM Evaluator] Score awarded: {score:.2f}")
    return round(score, 2), feedback

def adjust_difficulty(current_difficulty: int, latest_score: float) -> int:
    """
    Adjusts the difficulty of the next question based on the evaluation result.
    If the score is good, increase difficulty; if poor, decrease.
    """
    if latest_score >= 8.0:
        return min(current_difficulty + 1, 3) # Max difficulty 3
    elif latest_score <= 4.0:
        return max(current_difficulty - 1, 1) # Min difficulty 1
    return current_difficulty
