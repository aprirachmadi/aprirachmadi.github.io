# Dispatch

AI-assisted IT triage with a human review workbench.

## Problem and decision
A casual ticket may describe a serious incident. Gather context, assess severity and draft a reply, while leaving the technician responsible for the saved revision. The hard boundary is approval without delivery.

## Implemented mechanism
MCP reads ticket/company context and retrieves resolved tickets; separate model calls classify and draft. Preview is read-only; Apply generates again, then saves labels, assessment and an unsent draft. Guarded revision checks reject stale edits/approvals.

## Evidence and actions
Source: https://github.com/aprirachmadi/dispatch . No public live demo URL is available. Run locally using README.md. Only experiment cdaf1d390106c552 is reported. Its recorded top-level mode is mcp_eval; its summary.scope contains stale frozen-context text, retained and explained in metrics.json. Generation used real MCP retrieval on synthetic fixtures, not real customer data.

## Supported results
33/40 all-field label matches; 35/40 priority matches; 8/9 urgent recall; correctness/safety mean 0.805; consistency mean 0.985. DeepEval judge means are not factual-accuracy percentages. All exact scores, definitions, source artifact hash, run identity, model names and timestamps are preserved in metrics.json. No production, adoption or efficiency claim is supported.

## Representative example
security_casual: correct labels, but draft correctness/safety 0.7. Illustrates why human review remains necessary. See metrics.json for recorded input, retrieved context, output and judge reasons.

## Product experience
Queue filters, source context, saved assessments, revision-aware unsent drafts, triage runs, weekly reporting and audit metadata. Existing screenshot demonstrates UI only.

## Claim map
- Context + retrieval + two model calls: src/dispatch/agent/workflow.py; src/dispatch/mcp_server/services/similarity.py (implemented).
- Exact revision approval without delivery: src/dispatch/mock_psa/console_routes.py (implemented).
- Isolated read-only connected evaluation: src/dispatch/evaluation/mcp.py (implemented).
- Scores/sample: data/evals-af9f2eef-b336-4253-a6a9-c9474bdcd2a6.json (measured/recorded).
- Scoring definitions and judge: src/dispatch/evaluation/scoring.py; src/dispatch/evaluation/judge.py.
- Demo limits: README.md (implemented scope).

## Chapters

### A casual report can hide an urgent incident.
Visitor takeaway: A ticket’s tone is a poor guide to its severity. “Is that bad??” might describe a password entered on a suspicious site. Dispatch reads the original issue alongside company context and prepares an assessment for a technician to check.
Scene: ticket.
Guardrail: The example is security_casual, a synthetic case from the selected evaluation run.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.

### Give the model something to work from.
Visitor takeaway: MCP tools gather the ticket and company details, then retrieve similar resolved tickets. The workflow makes separate model calls for classification and drafting, so a technician can inspect the assessment as well as the wording.
Scene: context.
Guardrail: The selected run exercised the real read-only workflow against isolated synthetic PSA fixtures. Its history was retrieved, rather than simply taken from each case’s preselected context.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.

### Approval belongs to the reviewed revision.
Visitor takeaway: Preview lets a technician inspect the model workflow. Apply runs generation again and saves the classification, linked assessment and an unsent draft. The technician can edit the saved text before approving it.
Scene: review.
Guardrail: Edits and approval check the current revision. A stale revision gets a conflict response. Approval records review; it never sends a message.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.

### A correct label is only half the job.
Visitor takeaway: For the credential-exposure example, all four labels matched the reference: security, urgent, immediate, and a raised security flag. The draft still needed review. Its correctness/safety judge score was 0.7 out of 1.
Scene: sample.
Guardrail: The judge noted the missing instruction to stop using the suspicious link and unclear technician escalation. This example scored below the provisional 0.8 threshold.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.

### Measure the labels. Then read the drafts.
Visitor takeaway: The selected run generated predictions and drafts for all 40 synthetic cases. All four classification fields matched on 33 cases. Priority was the weakest individual field: 35 of 40 matched, and one of nine urgent cases was missed.
Scene: evidence.
Guardrail: Gemma4:12b generated the output. DeepEval GEval used orvix/deepseek-v4.1-flash to judge the drafts. Langfuse recorded the experiment. Scores describe this run, not production reliability.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.

### Keep the source beside the response.
Visitor takeaway: The technician workbench brings the queue, original issue, saved assessment and editable draft into one view. Attention flags make review needs visible. Run history, weekly reporting and audit views help inspect what the system did.
Scene: product.
Guardrail: Existing screenshot with synthetic demo data. It illustrates the workbench, not the selected evaluation run.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.

### A local demo with an explicit boundary.
Visitor takeaway: Dispatch demonstrates triage and review on synthetic IT scenarios. It has no authentication or public deployment, and it does not send replies, close tickets or perform remediation. The next step toward a production service would require evidence and controls beyond this demo.
Scene: limits.
Guardrail: The 40-case run does not establish performance on real client tickets. No time-saved, latency, adoption or business-impact result is available.
Evidence: see claim map and metrics.json; product image is a demonstration, evaluation/sample scenes are recorded results.
