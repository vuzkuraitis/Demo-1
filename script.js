function displayExpenses(data) {
  const table = document.querySelector("tbody");
  //   isvalome lentele
  table.innerHTML = "";

  data.forEach((item) => {
    const tr = table.insertRow();

    const td1 = tr.insertCell();
    td1.textContent = item.id;

    const td2 = tr.insertCell();
    td2.textContent = item.type;

    const td3 = tr.insertCell();
    td3.textContent = item.amount;

    const td4 = tr.insertCell();
    const statusTag = document.createElement("span");
    statusTag.classList.add("tag", item.isPaidStatus ? "success" : "error");
    statusTag.textContent = item.isPaidStatus ? "Paid" : "Due";
    td4.append(statusTag);

    const td5 = tr.insertCell();
    td5.textContent = item.email;

    const td6 = tr.insertCell();
    // konvertuojam i nauja data
    td6.textContent = new Date(item.date).toLocaleDateString("en-gb");
  });
}

function displayNotices(data) {
  const notices = document.querySelector(".noticeBoardContent");
  notices.innerHTML = "";
  const authorColors = ["red", "blue", "green"];

  data.forEach((item) => {
    const notice = `
    <div class="notice">
      <time>
      ${new Date(Number(item.timestamp)).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</time>
      <div class="meta">
        <author style="color:${
          authorColors[Math.floor(Math.random() * authorColors.length)]
        }">${item.first_name + " " + item.last_name}</author>
        <span class="timeago">
        ${timeAgoCalc(Date.now() - Number(item.timestamp))}</span>
      </div>
      <div class="text">
        ${item.content}
      </div>
    </div>
    `;

    notices.innerHTML += notice;
  });
}

function timeAgoCalc(time) {
  const minutes = time / 60000;
  if (minutes / 60 / 24) {
    return `${Math.floor(minutes / 60 / 24)} days ago`;
  }
  if (minutes > 60) {
    return `${Math.floor(minutes / 60)} hours ago`;
  }
  return `${Math.floor(minutes)} minutes ago`;
}

function duePayable(data) {
  const payableLocation = document.querySelector(
    ".banner:nth-child(1) .toptext h1"
  );
  payableLocation.textContent =
    "$" +
    data
      .filter((item) => !item.isPaidStatus)
      .map((item) => Number(item.amount.slice(1)))
      .reduce((acc, val) => acc + val);
}

function sumExpenses(data) {
  const expenseSumLocation = document.querySelector(
    ".banner:nth-child(2) .toptext h1"
  );
  expenseSumLocation.textContent =
    "$" +
    data
      .map((item) => Number(item.amount.slice(1)))
      .reduce((acc, val) => acc + val);
}

function countNotices(data) {
  const noticeLocation = document.querySelector(
    ".banner:nth-child(3) .toptext h1"
  );
  noticeLocation.textContent = data.length;
}

function largestExpenseType(data) {
  const largestExpenseTypeLocation = document.querySelector(
    ".banner:nth-child(4) .toptext h1"
  );
  //   prasivalon, kad ismestu tik elemento type ir amount
  const elements = data.map((item) => ({
    type: item.type,
    amount: Number(item.amount.slice(1)),
  }));

  //   pasiimam tik unikalius type
  const types = [...new Set(elements.map((item) => item.type))];

  // Calculate sums of each unique type
  const sums = types.map((item) => ({
    type: item,
    amount: elements
      .filter((element) => element.type === item)
      .reduce((a, v) => a + v.amount, 0),
  }));
  // sort types by amount size
  sums.sort((a, b) => b.amount - a.amount);
  // display only first sort type
  largestExpenseTypeLocation.textContent = sums[0].type;

  console.log(sums[0]);

  console.log(sums);
  //   item  = misc

  console.log(types);

  console.log(elements);
}

// Fetch expenses data

fetch("https://gravel-few-bowler.glitch.me/expenses")
  .then((res) => res.json())
  //   .then((data) => console.log(data)); pasitikrinam duomenis ar gaunam
  .then((data) => {
    displayExpenses(data);
    duePayable(data);
    sumExpenses(data);
    largestExpenseType(data);
  });

fetch("https://gravel-few-bowler.glitch.me/notices")
  .then((res) => res.json())
  //   .then((data) => console.log(data)); pasitikrinam duomenis ar gaunam
  .then((data) => {
    displayNotices(data);
    countNotices(data);
  });
