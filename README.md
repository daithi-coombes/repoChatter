# Tech Test for SportDec

#### The Challenge

 1. Create a commandline API mashup of the Github and Twitter APIs
 2. Search for "Football" projects on GitHub then, for a chosen subset of these projects, search for tweets mentioning those projects
 3. Output the Github summary of each project together with a list of recent tweets

#### Usage

```bash
npm start
```

#### Unit Tests

```bash
npm test
```

### Notes

 - Don't re-invent the wheel. In production scenario I would normally use packages/modules already created for each resource (github, twitter)
 - `ConsumerTwitter::authenticate` is covered twice by unit tests
 - Big O notation hasn't been measured in `Cli::displayResults` @see Roadmap

### Roadmap

  - Use a terminal interface as window API [blessed](https://github.com/chjj/blessed#windows-compatibility)
  - Refactor results parsed by `Cli::displayResults` so that only one `for of` loop is needed.
