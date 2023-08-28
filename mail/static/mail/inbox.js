document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);
  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  let recipients = document.querySelector("#compose-recipients");
  let subject = document.querySelector("#compose-subject");
  let body = document.querySelector("#compose-body");
  // Clear out composition fields
  recipients.value = "";
  subject.value = "";
  body.value = "";

  document
    .querySelector("#submit-btn")
    .addEventListener("click", () => send_mail(recipients, subject, body));
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  let emailID = "";
  let emailRecipient = "";
  let emailSender = "";
  let emailSubject = "";
  let emailBody = "";
  let emailTimestamp = "";

  let mails = " ";

  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((email) => {
      for (let i = 0; i < email.length; i++) {
        emailID = `${email[i].id} `;
        emailRecipient = `${email[i].recipients[0]} `;
        emailSender = `${email[i].sender} `;
        emailSubject = `${email[i].subject}`;
        emailBody = `${email[i].body}`;
        emailTimestamp = `${email[i].timestamp}`;
        const isRead = email[i].read;

        const emailClass = isRead ? "read-email" : "unread-email";

        mails += `<div class="mail-border ${emailClass}" type="button" data-emailID ="${emailID}"> 
        <li>
        <span class="sender">${emailSender} </span>
        <span class="subject">${emailSubject} </span>
        <span class="time"> ${emailTimestamp} </span>
        </li> 
        </div>`;
      }

      let emailsEl = document.querySelector("#emails-view");
      emailsEl.innerHTML += mails;
      console.log(email);

      const allMails = document.querySelectorAll(".mail-border");
      allMails.forEach((item) => {
        item.addEventListener("click", () => {
          emailID = item.getAttribute("data-emailID");
          view_email(emailID);
        });
      });
    });
}

function send_mail(recipients, subject, body) {
  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients.value,
      subject: subject.value,
      body: body.value,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      // Print result
      alert(result.message);

      load_mailbox("sent");
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch
      console.error("Fetch error:", error);
      alert(result.error);
    });
}

// function view_email(id, sender, recipient, subject, body, timestamp) {
function view_email(id) {
  console.log(id);
}
const mailInstance = document.querySelectorAll(".mail-border");
