## What this changes

<!-- One or two sentences. The why matters more than the what. -->

## Checks

- [ ] `npm test` (60 tests, Node 22 and 24)
- [ ] `npm run build`
- [ ] `npm run dist:public` still passes its leak and structural checks
- [ ] The `public` profile is still passive — no ban path reachable by default

<!-- New detection rule? Add the rule file, a test that fires on it, and a test
     that does not fire on a benign request that looks similar. -->
