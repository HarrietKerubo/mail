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

  document.querySelector("#submit-btn").addEventListener("click", () => {
    const recipientEl = document.querySelector("#compose-recipients");
    const subjectEl = document.querySelector("#compose-subject");
    const bodyEl = document.querySelector("#compose-body");
    send_mail(recipientEl, subjectEl, bodyEl);
  });
  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email(
  replyRecipient,
  replySubject,
  replyTimestamp,
  replyBody
) {
  // Show compose view and hide other viewsvalue
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  document.querySelector("#display-view").style.divaluesplay = "none";
  const recipientEl = document.querySelector("#compose-recipients");
  const subjectEl = document.querySelector("#compose-subject");
  const bodyEl = document.querySelector("#compose-body");
  if ((replyRecipient, replySubject, replyTimestamp, replyBody)) {
    recipientEl.value = replyRecipient;
    if (!replySubject.startsWith("Re:")) {
      subjectEl.value = `Re: ${replySubject}`;
    } else {
      subjectEl.value = replySubject;
    }

    bodyEl.placeholder = `On ${replyTimestamp} ${replyRecipient} wrote: ${replyBody}`;
  } else {
    // Clear out composition fields
    recipientEl.value = "";
    subjectEl.value = "";
    bodyEl.value = "";
  }
}

function load_mailbox(mailbox) {
  // Show the mailboxpadding-bottom: 20px  and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#display-view").style.display = "none";
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

        mails += `<div class="mail-border ${emailClass}" type="button" 
        data-emailID ="${emailID}"
        data-recipient = "${emailRecipient}"
        data-sender = "${emailSender}"
        data-subject = "${emailSubject}"
        data-body = "${emailBody}"
        data-timestamp = "${emailTimestamp}"
        data-mailbox = "${mailbox}"
        > 
        <li>
        <div class="mail-header">
        <span class="sender">${emailSender} </span>
        <span class="subject">${emailSubject} </span>
        </div>
        <span class="time"> ${emailTimestamp} </span>
        </li> 
        </div>`;
      }

      let emailsEl = document.querySelector("#emails-view");
      emailsEl.innerHTML += mails;

      const allMails = document.querySelectorAll(".mail-border");
      allMails.forEach((item) => {
        item.addEventListener("click", () => {
          emailID = item.getAttribute("data-emailID");
          recipient = item.getAttribute("data-recipient");
          sender = item.getAttribute("data-sender");
          subject = item.getAttribute("data-subject");
          body = item.getAttribute("data-body");
          timestamp = item.getAttribute("data-timestamp");

          let mailBox = item.getAttribute("data-mailbox");

          view_email(
            emailID,
            recipient,
            sender,
            subject,
            body,
            timestamp,
            mailbox
          );
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
function view_email(id, recipient, sender, subject, body, timestamp, mailbox) {
  // Show the email display and hide other views
  let displayEl = document.querySelector("#display-view");
  displayEl.style.display = "block";
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";

  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });

  fetch(`/emails/${id}`)
    .then((response) => response.json())
    // pass the attributes that you got from function load_mail and then declare an anonymous function () to execute required code
    .then(
      (id,
      recipient,
      sender,
      subject,
      timestamp,
      body,
      () => {
        displayEl.innerHTML = `
        <div id="meta-data">
        <div> 
        <span class="title"> From: </span>
        <span class="content"> ${sender} </span> </div>
        <div>  <span class="title"> To:  </span>
        <span class="content"> ${recipient} </span></div>
        <div> <span class="title"> Subject: </span>
        <span class="content"> ${subject} </span> </div>
        <div>  <span class="title"> Timestamp: </span>
        <span class="content"> ${timestamp} </span></div>
        </div>
        <div>
        <input id="reply-btn" type="button" class="btn btn-primary" value="Reply" />
        </div>
        <hr />
        <div style="font-size: 20px; padding-bottom: 10px ;"> ${body} </div>
        <div> 
         `;
        if (mailbox === "inbox") {
          displayEl.innerHTML += `<div> 
    <input id="archive-btn" type="button" class="btn btn-primary" value="Archive Email" />
    </div>`;
          document
            .querySelector("#archive-btn")
            .addEventListener("click", () => archive_mail(id));
        } else if (mailbox === "archive") {
          displayEl.innerHTML += `<div> 
          <input id="archive-btn" type="button" class="btn btn-primary" value="Unarchive Email" />
          </div>`;
          document
            .querySelector("#archive-btn")
            .addEventListener("click", () => unarchive_mail(id));
        }

        document
          .querySelector("#reply-btn")
          .addEventListener("click", () =>
            compose_email(sender, subject, timestamp, body)
          );
      })
    );
}

function archive_mail(id) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: true,
    }),
  }).then(() => {
    load_mailbox("inbox");
  });
}

function unarchive_mail(id) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: false,
    }),
  }).then(() => {
    load_mailbox("inbox");
  });
}
