# Automating Gitlab project transfer

## Configure

### Set the namespace

Be sure to update the value of `studentNamespace` in the `gitlab-transfer`. This should match the student namespace. This will drive where the projects are moved from and deposited. For example, `http://gitlab.lowell.perseverenow.org/users/`**twestbrook**`/projects`

Also, be sure the `Cohort 01` group with the same value as `studentNamespace`.  

### Environment Variables file 

You'll need a `.env` file with the following properties.

```bash
GITLAB_USER = 'you@company.org'
GITLAB_PASS = 'your-password-goes-here'
```


## Usage

Once the value of `studentNamespace` is correct, kick off the process by running the following command. 

```bash 
npx playwright test --repeat-each=13 --headed --workers 1
```

NOTE: only use one worker. Otherwise, all workers will grab the first file since it's still there until fully transfered. 


