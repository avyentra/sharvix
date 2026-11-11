SHARVIX STUDIO WEBSITE
======================

PAGES
  index.html      Home page (services, process, tech stack, work, training, FAQ, enquiry form)
  training.html   3-month training page (curriculum, projects, fees, enrolment form, FAQ)
  privacy.html    Privacy policy (template - please review)
  terms.html      Terms of service (template - please review)
  404.html        "Page not found" page

FILES
  style.css / style.min.css   Styling (edit style.css, the site loads style.min.css)
  script.js / script.min.js   Script (edit script.js, the site loads script.min.js)
  assets/         Images (WebP), logos, favicons, syllabus PDF
  robots.txt / sitemap.xml   SEO files, set to sharvixstudio.com
  .htaccess       Shows 404.html on Apache/cPanel hosting

FORMS -> EMAIL (manu.innn@gmail.com)
  All forms (enquiry, enrolment, footer subscribe) send to manu.innn@gmail.com
  using FormSubmit (free). IMPORTANT:
   1. Upload the site to AWS S3 and CloudFront (forms do not send from a local file).
   2. Submit any form once. FormSubmit sends an "Activate form" email to
      manu.innn@gmail.com - open it and click Activate.
   3. After that, every submission arrives in that inbox.
  To change the email: edit FORM_EMAIL at the top of script.js.
  If sending fails, the form shows a WhatsApp link (8360631515) with the same details.

TO UPDATE LATER (search for "TODO" or "NOTE" in the files)
  - Batch mode & timings (training.html: "Online / Classroom", "To be announced")
  - After each batch: update the next batch date (training.html + index.html)
  - Instagram / LinkedIn links in the footer when ready
  - Portfolio: 6 projects load live from Behance (behance.net/mangat).
    To change them, edit the "WORK / PORTFOLIO" block in index.html.
  - Testimonials section was removed (no real reviews yet). Can be added back later.
  - Tech stack: tiles show initials; to use official logos put SVGs in
    assets/tech/ and replace <span class="tool-m">..</span> with <img>.
