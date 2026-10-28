# Adeniji Clement Bamikole — Static Portfolio

This is a static website made with HTML, CSS, and vanilla JavaScript. It has exactly three pages: `index.html` (Home), `about.html` (About), and `contact.html` (Contact). It does not use Flask, a server-side backend, or a database.

## Preview it on your computer

Open `index.html` in a browser. The links, CSS, images, menu, and theme toggle work as static files.

## Contact form behavior

The Contact form checks the fields in the browser, then opens the visitor's default email app with the recipient, subject, and message filled in. The visitor must review and send the email in that app. The site does not collect or store submissions. A direct email link is also shown if the visitor does not have an email app configured.

## Free hosting with GitHub Pages

GitHub Pages serves static files. With GitHub Free, the repository needs to be public. The published site is public too, so keep only information you intend to share publicly.

1. Create a **public** repository on GitHub.
2. Upload the contents of this folder to the repository root. Confirm `index.html` is at the root beside `about.html`, `contact.html`, and `static/`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then save.
6. Wait for the Pages build to finish and use the site link shown under the Pages settings.

See GitHub's [Pages setup guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for current instructions.

## Personal details to update later

- Replace `static/images/profile-placeholder.svg` with a professional photo and update the `src` and alt text on Home and About.
- Add actual project dates, tools, and links if you want to show them.
- Add the certificate issue date if available.

The site currently includes the personal details you provided, including your email address, phone number, school, training, certificate link, and social profiles. Review them before making the repository public.
