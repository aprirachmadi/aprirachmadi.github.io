# Tilik — case-study brief

Tilik answers questions about Indonesian public data. It routes each question to its own BPS, BNPB, BMKG, Bapanas or SiPongi MCP server and returns a cited answer, with an optional chart.

## Problem and approach

The difficulty is preserving the meaning of a figure while locating and explaining it. The project separates source selection, deterministic statistical computation and answer writing. This is an implementation description, not a claim of research novelty or business impact.

## Story chapters

### A simple question hides a precise lookup.

A BPS figure only makes sense when you know what it measures, where it applies, and when it was recorded. Tilik takes a question in everyday language and looks for the figures and published explanations needed to answer it.

Evidence / guardrail: This example comes from the project’s question set. It shows what Tilik needs to look up, without inventing a result.

### Decide which source the question needs.

Some questions need statistics. Others need a weather feed, a food price or a disaster count. Tilik decides which sources to consult, gathers the evidence from each source’s own server, and then writes the answer. It also uses earlier messages to understand follow-up questions.

Evidence / guardrail: LangGraph connects these steps and the sources are reached over MCP. If the request cannot be understood, Tilik reports the problem instead of continuing with an invalid plan.

### Every source speaks for itself.

BPS figures and the SP2020 publication come from data loaded into Tilik’s database, and BNPB disaster counts are synchronized daily. BMKG is fetched live, while Bapanas and SiPongi are read both live and from a monthly sync. Where a source has no documented public API, Tilik calls the same routes its public pages call and validates every response.

Evidence / guardrail: Tilik answers only from these five sources. It does not search the open web.

### Separate interpretation from computation.

Questions about provinces may ask how two measures move together, how large the differences are, or whether gaps are narrowing. Tilik checks the selected data, then lets Python perform those statistical calculations.

Evidence / guardrail: The model chooses an operation and explains the result. The statistical calculation runs in code; ordinary arithmetic in generated text still needs review.

### Keep the evidence attached to the answer.

Tilik keeps the source references with its answer. Readers can open the source table, publication or feed behind a response, with its retrieval time. Before returning the answer, the system checks that its cited evidence IDs came from the evidence gathered during that run.

Evidence / guardrail: A valid reference is a starting point for checking an answer. It does not guarantee that every sentence interprets the source correctly.

### Evaluate behavior, not just a polished reply.

Langfuse tracks experiments: the question, the tools used, the answer, and the scores from each run. DeepEval provides LLM-as-a-judge metrics to assess whether Tilik completed the task and passed the right arguments to its tools. The judges are checked too, against answers a human has labeled.

Evidence / guardrail: Judge agreement with human labels is 91% for task completion and 48% for argument correctness, so treat the argument-correctness score as a rough signal. The other metrics are listed as not tested yet.

### Make the evidence usable in a conversation.

Ask a question in Indonesian, let Tilik choose the source or pick one yourself, return to an earlier conversation, and open the sources behind an answer. When a comparison calls for a chart, the interface can draw it alongside the explanation.

Evidence / guardrail: The screenshot is a live demo conversation: national flood and landslide counts from BNPB, drawn as a chart with its cited source. React handles the workspace, FastAPI serves the answers, and PostgreSQL stores conversation history.

### A useful boundary is part of the answer.

Tilik can only answer from the five sources it is connected to. A wrong measure, time period, or regional comparison can still mislead. Source links and calculations make the work easier to check, but the final explanation still needs judgment.

Evidence / guardrail: The lesson: find the evidence, calculate carefully, and make it easy for a reader to check the answer. A statistical relationship does not establish cause and effect.

## Scores

Reported by the project owner: task completion 73%, argument correctness 81%. Judge-to-human agreement: task completion 91%, argument correctness 48%. No saved run artifact was inspected. The repository holds a 45-question generation benchmark and a judge benchmark of 33 human-labeled answers; it was not verified that the scores were produced on those sets.

## Provenance

- Pipeline, connectors and benchmark commands: the `README.md` of the tilik-agent repository (November 2026).
- Question example: `src/tilik_agent/evals/datasets/`.
- Source links and workspace: `frontend/src/components/SourceChips.tsx; frontend/src/pages/Workspace.tsx; src/tilik_agent/chat/storage.py`

## Visual direction

Follows the portfolio’s Evidence Edition: paper background, navy ink, violet and acid-green accents, Space Grotesk with DM Mono labels. Desktop narrative beside a sticky visual stage; mobile scenes below each chapter; all narrative and visuals available without JavaScript.

## Assets

workspace.png is a capture of the live demo. architecture.svg is an authored diagram of the current implementation. All walkthrough scenes are explanatory, not recorded agent answers. No BPS figures or publication pages are reproduced.
