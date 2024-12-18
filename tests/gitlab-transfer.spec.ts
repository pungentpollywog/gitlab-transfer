import { test, expect } from '@playwright/test';

// import dotenv from 'dotenv';
// dotenv.config();

import { config } from 'dotenv';

config();

interface environ {
  [key: string]: string;
}

let creds: environ = {};

const studentNamespace = 'apiellucci';

test.beforeAll(async () => {
  creds = {
    username: process.env.GITLAB_USER,
    password: process.env.GITLAB_PASS,
  };
});

function getProjectSlug(url: string, namespace: string) {
  let slug = 'slug-not-found';
  const segments = url.replace('//', '/').split('/');
  const namespaceIdx = segments.findIndex((val) => val === namespace);
  if (namespaceIdx !== -1) {
    slug = segments.at(-1);
  }
  return slug;
}

test('transfer-project', async ({ page }) => {
  await page.goto('http://gitlab.lowell.perseverenow.org/users/sign_in');
  await page.getByTestId('username-field').click();
  await page.getByTestId('username-field').fill(creds.username);
  await page.getByTestId('password-field').click();
  await page.getByTestId('password-field').click();
  await page.getByTestId('password-field').fill(creds.password);
  await page.getByTestId('sign-in-button').click();

  await page.goto(
    `http://gitlab.lowell.perseverenow.org/users/${studentNamespace}/projects`
  );

  const linkLocator = page
    .getByTestId('projects-list')
    .getByRole('listitem')
    .first()
    .getByTestId('project-content')
    .getByRole('link');

  const projectName = await linkLocator.textContent();

  await linkLocator.click();

  const projectSlug = getProjectSlug(page.url(), studentNamespace); 

  await page.getByRole('button', { name: 'Settings' }).click();

  await page.getByRole('link', { name: 'General' }).click();

  await page.goto(
    `http://gitlab.lowell.perseverenow.org/${studentNamespace}/${projectSlug}/edit`
  );
  await page.getByRole('heading', { name: 'Advanced' }).click();
  await page.getByRole('button', { name: 'Select a new namespace' }).click();

  await page.getByTestId('transfer-locations-search').click();
  await page.getByTestId('transfer-locations-search').fill(studentNamespace);

  const menuItemRegEx = new RegExp(`Cohort 01 / ${studentNamespace}`);
  await page.getByRole('menuitem', { name: menuItemRegEx }).click();

  await page.getByTestId('transfer-project-button').click();
  await page.getByTestId('confirm-danger-field').click();
  await page.getByTestId('confirm-danger-field').fill(projectName || '');

  await page.getByTestId('confirm-danger-modal-button').click();

  await page.goto(
    `http://gitlab.lowell.perseverenow.org/users/${studentNamespace}/projects`
  );
});
