# Tilik — case-study brief

Tilik answers questions about BPS statistics using published observations and the SP2020 demography publication.

## Problem and approach

The difficulty is preserving the meaning of a statistical observation while locating and explaining it. The project separates evidence selection, deterministic statistical computation and answer writing. This is an implementation description, not a claim of research novelty or business impact.

## Story chapters

### A simple question hides a precise lookup.

A statistic is more than a number. Its meaning depends on the measure, period, geography, population and unit. Tilik turns a natural-language question about Indonesia’s official statistics into work over published observations and publication evidence.

Evidence / guardrail: The walkthrough starts with a real benchmark question. It illustrates the lookup process without inventing an answer or unemployment figures.

Scene: question. Takeaway: A simple question hides a precise lookup.

### Decide what evidence the question needs.

A LangGraph workflow interprets the request and chooses observation lookup, publication retrieval, or both. Follow-up questions also receive conversation context. Requested statistical analysis runs after source selection; direct replies and planning failures take their own routes.

Evidence / guardrail: The model chooses the work. Structured tools and validated state carry it through.

Scene: plan. Takeaway: Decide what evidence the question needs.

### A table gives a value. A publication gives context.

Observation tools search datasets, inspect measures and dimensions, and fetch values through a read-only database role. A separate retrieval path searches the configured SP2020 demography collection, grades excerpts for relevance, and rewrites the query within a configured limit.

Evidence / guardrail: Tilik answers from material already loaded into PostgreSQL and pgvector. It does not search the live web.

Scene: sources. Takeaway: A table gives a value. A publication gives context.

### Separate interpretation from computation.

For province-level statistical questions, the model selects an operation and validated series. Python loads the underlying observations and computes correlation, ordinary least squares, dispersion, convergence or paired comparisons. It checks province identities and rejects invalid or duplicate cells before analysis.

Evidence / guardrail: This boundary matters: the language model can explain a result without being responsible for calculating it. Ordinary model-written arithmetic is a separate limitation.

Scene: analysis. Takeaway: Separate interpretation from computation.

### Keep the evidence attached to the answer.

The response carries observation and document identifiers. The answer writer rejects identifiers that were not gathered during the run; statistical results also carry their selection identities. The interface can link dataset sources to BPS tables and document sources to the SP2020 publication.

Evidence / guardrail: Citation validation checks whether a source exists in the gathered evidence. It does not prove that every sentence faithfully describes it.

Scene: provenance. Takeaway: Keep the evidence attached to the answer.

### Evaluate behavior, not just a polished reply.

The repository defines 19 question cases and 4 scripted conversations. Its evaluation harness uses referenceless LLM judges for task completion and tool arguments, with additional conversation metrics. Pipeline status is reported separately from judge scores.

Evidence / guardrail: No authoritative saved aggregate run was found for this article. Dataset counts describe evaluation coverage, not measured accuracy.

Scene: evidence. Takeaway: Evaluate behavior, not just a polished reply.

### Make the evidence usable in a conversation.

A React and Vite workspace brings the workflow into an Indonesian-language interface. Users can ask questions, revisit conversations, inspect source links and view chart specifications rendered by the frontend. FastAPI exposes the agent and conversation APIs; Postgres stores conversation history.

Evidence / guardrail: The screenshot is an existing product capture, not a generated response or a benchmark result.

Scene: product. Takeaway: Make the evidence usable in a conversation.

### A useful boundary is part of the answer.

Coverage follows the ingested tables and configured publication. Retrieval limits, dataset selection and changes in province boundaries affect what can be supported. Deterministic statistics help with computation, but generated explanations still need review and statistical association is not causation.

Evidence / guardrail: The implementation’s central lesson: separate selecting evidence, computing results and explaining them, then preserve enough provenance to inspect each boundary.

Scene: limits. Takeaway: A useful boundary is part of the answer.

## Provenance

- Question example and evaluation counts: `src/tilik_agent/evals/datasets/demografi_sosial_questions.json; src/tilik_agent/evals/datasets/demografi_sosial_conversations.json`
- Current routing: `src/tilik_agent/agent/graph.py; src/tilik_agent/agent/workers.py`
- Read-only tools: `src/tilik_agent/agent/sql.py`
- Retrieval grading and rewrites: `src/tilik_agent/agent/retrieval.py; configs/default.yaml`
- Deterministic statistics: `src/tilik_agent/agent/analysis.py; src/tilik_agent/agent/statistics.py; tests/test_statistical_analysis.py`
- Identifier validation and chart specs: `src/tilik_agent/agent/answer.py`
- Source links and workspace: `frontend/src/components/SourceChips.tsx; frontend/src/pages/Workspace.tsx; src/tilik_agent/chat/storage.py`

## Discrepancies

The README describes an older planner/calculation flow; the current graph uses request interpretation and a deterministic statistical-analysis branch. The legacy arithmetic validator explicitly states it is not called by the current graph. Portfolio card scores (0.8800 and 0.8655) lack a saved authoritative run artifact in the inspected repository, so they are not republished. The deployment domain appears in configuration, but live availability was not verified; the article links to source only.

## Visual direction

Inherit the portfolio’s warm editorial shell. Use a paper-and-teal evidence stage, real interface capture and readable diagrams. Desktop narrative beside sticky visual stage; mobile scenes below each chapter; all narrative and visuals available without JavaScript.

## Assets

workspace.png is an existing screenshot already used in the public portfolio. architecture.svg is an authored diagram of the current implementation. All walkthrough scenes are explanatory, not recorded agent answers. No BPS figures or publication pages are reproduced.
