package com.myenglishcoach.modules.assessment.domain;

public record AssessmentResult(String cefrLevel, int confidence, String summary,
                               DimensionScores scores, String studyPlan) {
    public record DimensionScores(int grammar, int vocabulary, int fluency, int comprehension) {}
}
