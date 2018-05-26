const cli = require('commander'),
  {prompt} = require('inquirer');

const questions = [
    {
      type : 'input',
      name : 'githubKeyword',
      message : 'Enter keyword to search GitHub'
    },
  ],
  questionRepos = [
    {
      type: 'input',
      name: 'selectedRepos',
    }
  ];

cli.version('0.0.1')
  .description('Tech Test');

cli.command('search')
  .alias('s')
  .description('Enter repo to search')
  .action(()=>{
    prompt(questions)
      .then((answers)=>{

        const githubResults = [
            {name: 'repo 1'},
            {name: 'repo 2'},
            {name: 'repo 3'},
            {name: 'repo 4'},
            {name: 'repo 5'},
            {name: 'repo 6'},
            {name: 'repo 7'},
            {name: 'repo 8'},
          ],
          strRepos = [];

        for(const [index, value] of githubResults.entries()){
          strRepos.push(`[${index}] ${value.name}`);
        }

        questionRepos[0].message = 'Please enter numbers of selected repos seperated by comma\'s: (eg 3,5,7)\n' + strRepos.join('\n') + '\n';
        prompt(questionRepos)
          .then(selectedRepos => {

            console.log('Your selected repos: ', selectedRepos);
            console.log('Search twitter for tweets...');
            console.log('Selected tweets: ');

            const tweetResults = ['foo', 'bar', 'biz', 'baz'];
            console.log('\t' + tweetResults.join('\n\t'));
          });
      });
  });

cli.parse(process.argv);
