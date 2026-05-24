# gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

Install gstack (one-time, per machine):
```sh
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

Available gstack skills:
- `/office-hours` — structured office hours session
- `/plan-ceo-review` — CEO review of a plan
- `/plan-eng-review` — engineering review of a plan
- `/plan-design-review` — design review of a plan
- `/design-consultation` — design consultation session
- `/design-shotgun` — rapid design exploration
- `/design-html` — generate HTML designs
- `/review` — code review
- `/ship` — ship a feature end-to-end
- `/land-and-deploy` — land and deploy changes
- `/canary` — canary deployment
- `/benchmark` — run benchmarks
- `/browse` — headless browser for web browsing, QA, and dogfooding
- `/connect-chrome` — connect to Chrome browser
- `/qa` — full QA session
- `/qa-only` — QA without implementation
- `/design-review` — design review
- `/setup-browser-cookies` — set up browser cookies
- `/setup-deploy` — configure deployment
- `/setup-gbrain` — configure gbrain
- `/retro` — retrospective
- `/investigate` — investigate an issue
- `/document-release` — document a release
- `/document-generate` — generate documentation
- `/codex` — codex skill
- `/cso` — CSO review
- `/autoplan` — automatic planning
- `/plan-devex-review` — developer experience review of a plan
- `/devex-review` — developer experience review
- `/careful` — careful/safe mode
- `/freeze` — freeze changes
- `/guard` — guard mode
- `/unfreeze` — unfreeze changes
- `/gstack-upgrade` — upgrade gstack
- `/learn` — learning session

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
