const filterGroupSelect = document.querySelector("#group-filter");
const groupSelect = document.querySelector("#positionType");
const studentForm = document.querySelector(".student-form");
const studentModal = document.querySelector("#student-modal");
const studentTableBody = document.querySelector(".student-table tbody");
const modalOpenBtn = document.querySelector(".modal-open-btn");
const modalSubmitBtn = document.querySelector(".modal-submit-btn");
const studentSearchInput = document.querySelector(".student-search-input");
const firstNameSortSelect = document.querySelector("#firstName-sort");
const salarySortSelect = document.querySelector("#salary-sort");
const marriageSortCheck = document.querySelector("#marriage-sort");
const specialityRow = document.querySelector("#speciality");

let studentsJson = localStorage.getItem("students");

let students = JSON.parse(studentsJson) || [];
let selected = null;
let search = "";
let positionType = "All";
let sort = "Clear";
let salarySort = "Salary";
let marriageSort = "No";

filterGroupSelect.innerHTML = `<option>All</option>`;

positions.map((pos) => {
  filterGroupSelect.innerHTML += `<option>${pos}</option>`;
  groupSelect.innerHTML += `<option>${pos}</option>`;
});

speciality.map((spc) => {
  specialityRow.innerHTML += `<option>${spc}</option>`;
});

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  this.classList.add("was-validated");
  if (this.checkValidity()) {
    let {
      firstName,
      lastName,
      address,
      date,
      speciality,
      positionType,
      salary,
      isMarried,
    } = this.elements;
    let student = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      date: date.value,
      speciality: speciality.value,
      positionType: positionType.value,
      salary: salary.value,
      isMarried: isMarried.checked,
    };

    if (selected === null) {
      students.push(student);
    } else {
      students[selected] = student;
    }

    localStorage.setItem("students", JSON.stringify(students));
    bootstrap.Modal.getInstance(studentModal).hide();

    this.classList.remove("was-validated");

    getStudents();
  }
});

function getStudentRow(
  {
    firstName,
    lastName,
    address,
    date,
    speciality,
    positionType,
    salary,
    isMarried,
  },
  i
) {
  return `
    <tr>
      <th scope="row">${i + 1}</th>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${address}</td>
      <td>${date}</td>
      <td>${speciality}</td>
      <td>${positionType}</td>
      <td>${salary}</td>
      <td>${isMarried ? "Yes" : "No"}</td>
      <td class="text-end action-buttons">
        <button onclick="editStudent(${i})" data-bs-toggle="modal" data-bs-target="#student-modal" class="me-3 btn btn-primary">Edit</button>
        <button onclick="deleteStudent(${i})" class="btn btn-danger">Delete</button>
      </td>
    </tr>
  `;
}

function getStudents() {
  let results = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  if (positionType !== "All") {
    results = results.filter(
      (student) => student.positionType === positionType
    );
  }

  if (salarySort !== "Salary") {
    results.sort((a, b) => {
      if (salarySort === "Highest") {
        return b.salary - a.salary;
      } else if (salarySort === "Lowest") {
        return a.salary - b.salary;
      } else {
        return 0;
      }
    });
  }

  if (sort !== "Clear") {
    results.sort((a, b) => {
      let nameA;
      let nameB;
      if (sort === "A-Z") {
        nameA = a.firstName.toLowerCase();
        nameB = b.firstName.toLowerCase();
      } else {
        nameB = a.firstName.toLowerCase();
        nameA = b.firstName.toLowerCase();
      }

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  if (results.length !== 0) {
    studentTableBody.innerHTML = "";
    results.map((student, i) => {
      studentTableBody.innerHTML += getStudentRow(student, i);
    });
  } else {
    studentTableBody.innerHTML = ``;
  }
}

getStudents();

function deleteStudent(i) {
  let deleteConfirm = confirm("Are you sure you want to delete this student?");
  if (deleteConfirm) {
    students.splice(i, 1);
    localStorage.setItem("students", JSON.stringify(students));
    getStudents();
  }
}

function editStudent(i) {
  selected = i;
  modalSubmitBtn.textContent = "Save student";

  let {
    firstName,
    lastName,
    address,
    date,
    speciality,
    positionType,
    salary,
    isMarried,
  } = students[i];

  studentForm.firstName.value = firstName;
  studentForm.lastName.value = lastName;
  studentForm.address.value = address;
  studentForm.date.value = date;
  studentForm.speciality.value = speciality;
  studentForm.positionType.value = positionType;
  studentForm.salary.value = salary;
  studentForm.isMarried.checked = isMarried;
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
  modalSubmitBtn.textContent = "Add student";

  let {
    firstName,
    lastName,
    address,
    date,
    speciality,
    positionType,
    salary,
    isMarried,
  } = studentForm.elements;

  firstName.value = "";
  lastName.value = "";
  address.value = "";
  date.value = "";
  speciality.value = "";
  positionType.value = positions[0];
  salary.value = salary;
  isMarried.checked = false;
});

studentSearchInput.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});

filterGroupSelect.addEventListener("change", function () {
  positionType = this.value;
  getStudents();
});

firstNameSortSelect.addEventListener("change", function () {
  sort = this.value;
  getStudents();
});

salarySortSelect.addEventListener("change", function () {
  salarySort = this.value;
  getStudents();
});
