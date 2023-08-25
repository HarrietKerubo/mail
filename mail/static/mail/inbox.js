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

  let emailID = " ";
  let emailRecipient = " ";
  let emailSender = " ";
  let emailSubject = " ";
  let emailBody = " ";
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
        mails += `<div> <li> Sender : ${emailSender} Subject: ${emailSubject} Time: ${emailTimestamp} </li> </div>`;
      }

      let emailsEl = document.querySelector("#emails-view");
      console.log(emailsEl);
      emailsEl.innerHTML += mails;
      // console.log(email);
      // console.log(emailID);
      // console.log(emailRecipient);
      // console.log(emailSender);
      // console.log(emailSubject);
      // console.log(emailBody);
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
      // alert(result.message);
      alert(result.error);
      load_mailbox("sent");
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch
      console.error("Fetch error:", error);
    });
}
