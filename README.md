### Goatnote is our IT&C 350 Project for the winter 2022 semester. 

## Git / Github

* To see your local branches
```bash
git branch
```
* To see what changes can be staged and committed/see status of changes
```bash
git status
```
* To checkout (switch to) a different branch either locally or from github
```bash
git checkout <branch name>
```
* To create a new branch
```bash
git branch <new branch name> <parent branch>
```
OR to create a new branch and automatically switch to it
```bash
git checkout -b <new branch name> <parent branch>
```
* To push your branch to github / push changes
```bash
git push origin <branch name>
```
* To pull changes in from github
```bash
git pull origin <branch name>
```
* To delete a local branch
```bash
git branch -d <branch name>
```
* To refresh your branch if parent branch has new code
```bash
git rebase <parent branch>
```
* To merge a child branch into parent branch (must be on parent branch)
```bash
git merge origin <child branch>
```