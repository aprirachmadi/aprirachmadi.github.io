# Tilik — case-study brief

Tilik answers questions about BPS statistics using published observations and the SP2020 demography publication.

## Problem and approach

The difficulty is preserving the meaning of a statistical observation while locating and explaining it. The project separates evidence selection, deterministic statistical computation and answer writing. This is an implementation description, not a claim of research novelty or business impact.

## Story chapters

### A simple question hides a precise lookup.

A BPS figure only makes sense when you know what it measures, where it applies, and when it was recorded. Tilik takes a question in everyday language and looks for the figures and published explanations needed to answer it.

Evidence / guardrail: This example comes from the project’s question set. It shows what Tilik needs to look up, without inventing a result.

Scene: question. Takeaway: A simple question hides a precise lookup.

### Decide what evidence the question needs.

Some questions need numbers. Others need an explanation from a report. Tilik decides which sources to consult, gathers the evidence, and then writes the answer. It also uses earlier messages to understand follow-up questions.

Evidence / guardrail: LangGraph connects these steps. If the request cannot be understood, Tilik reports the problem instead of continuing with an invalid plan.

Scene: plan. Takeaway: Decide what evidence the question needs.

### A table gives a value. A publication gives context.

Tilik finds figures in BPS tables loaded into its database. It can also search the SP2020 demography publication for explanations. If a passage does not help answer the question, it can try a revised search before reaching its limit.

Evidence / guardrail: The answer depends on the data already loaded. Tilik does not search the live web.

Scene: sources. Takeaway: A table gives a value. A publication gives context.

### Separate interpretation from computation.

Questions about provinces may ask how two measures move together, how large the differences are, or whether gaps are narrowing. Tilik checks the selected data, then lets Python perform those statistical calculations.

Evidence / guardrail: The model chooses an operation and explains the result. The statistical calculation runs in code; ordinary arithmetic in generated text still needs review.

Scene: analysis. Takeaway: Separate interpretation from computation.

### Keep the evidence attached to the answer.

Tilik keeps the source references with its answer. Readers can open the BPS table or publication behind a response. Before returning the answer, the system checks that its cited references came from the evidence gathered during that run.

Evidence / guardrail: A valid reference is a starting point for checking an answer. It does not guarantee that every sentence interprets the source correctly.

Scene: provenance. Takeaway: Keep the evidence attached to the answer.

### Evaluate behavior, not just a polished reply.

Langfuse tracks experiments: the question, the tools used, the answer, and the scores from each run. DeepEval provides LLM-as-a-judge metrics to assess whether Tilik completed the task and passed the right arguments to its tools.

Evidence / guardrail: The two reported scores come from an earlier evaluation. They have not been retested against the newest evaluation sets: 19 questions and 4 conversations. The other metrics are listed as not tested yet.

Scene: evidence. Takeaway: Evaluate behavior, not just a polished reply.

### Make the evidence usable in a conversation.

Ask a question in Indonesian, return to an earlier conversation, and open the sources behind an answer. When a comparison calls for a chart, the interface can draw it alongside the explanation.

Evidence / guardrail: The existing screenshot shows the product interface. React handles the workspace, FastAPI serves the answers, and PostgreSQL stores conversation history.

Scene: product. Takeaway: Make the evidence usable in a conversation.

### A useful boundary is part of the answer.

Tilik can only answer from the tables and publication it has available. A wrong measure, time period, or regional comparison can still mislead. Source links and calculations make the work easier to check, but the final explanation still needs judgment.

Evidence / guardrail: The lesson: find the evidence, calculate carefully, and make it easy for a reader to check the answer. A statistical relationship does not establish cause and effect.

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

The README describes an older planner/calculation flow; the current graph uses request interpretation and a deterministic statistical-analysis branch. The legacy arithmetic validator explicitly states it is not called by the current graph. Portfolio card scores (0.8800 and 0.8655) were confirmed by the owner as historical results. They are published with an asterisk stating that they have not been retested against the newest evaluation sets. No saved aggregate run artifact was found. Remaining metrics are marked not tested yet; pipeline status is operational rather than a judge metric. The deployment domain appears in configuration, but live availability was not verified; the article links to source only.

## Visual direction

Inherit the portfolio’s warm editorial shell. Use a paper-and-teal evidence stage, real interface capture and readable diagrams. Desktop narrative beside sticky visual stage; mobile scenes below each chapter; all narrative and visuals available without JavaScript.

## Assets

workspace.png is an existing screenshot already used in the public portfolio. architecture.svg is an authored diagram of the current implementation. All walkthrough scenes are explanatory, not recorded agent answers. No BPS figures or publication pages are reproduced.
