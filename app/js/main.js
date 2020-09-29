function todoList() {
  // ---------------------------- Add new task

  const buttonAdd = document.querySelector(".btn-add");
  let todoList = [];
  if (localStorage.getItem("todo")) {
    todoList = JSON.parse(localStorage.getItem("todo"));
    console.log(todoList)
    out(todoList);
  }
  buttonAdd.addEventListener("click", addTodo);
  function addTodo() {
    let toDo = document.querySelector(".todo_field-first");
    console.log(toDo.value)
    if (toDo.innerText) {
      let temp = {
        todo: toDo.innerText,
        check: false,
      };
      todoList.push(temp);
      addtoLocalStorage();
      out(todoList);
      toDo.innerText = ''
    }
  }
  function out(x) {
    let out = document.querySelector(".out");
    out.innerHTML = "";
    for (let key in x) {
      out.insertAdjacentHTML(
        "beforeend",
        `<div class='todo'  data-value="${key}">
        <input type ='checkbox' class='todo_checkbox' ${x[key].check == true ? "checked" : ""} data-value="${key}"></input>
       <div class="small_btn todo_edit"></div>
       <div class="small_btn todo_delete"></div>
        <div class="todo_field" data-value="${key}">${x[key].todo}</div><div>`
      );
    }
    let a = document.querySelectorAll(".todo_field");
    a.forEach(function (x) {
      if (x.clientHeight < x.scrollHeight) x.style.height = x.scrollHeight + "px";
    });
    testChecked();
    delete_btn()
    edit_btn()
    main_filter()

  }
  // ---------------------------- Add to LocalStorage

  function addtoLocalStorage() {
    localStorage.setItem("todo", JSON.stringify(todoList));
  }

  // ---------------------------- Delete all tasks

  function delete_all() {
    const buttonReset = document.querySelector(".btn-reset");
    buttonReset.onclick = function () {
      if (confirm("Уверены?")) {
        localStorage.clear();
        location.reload();
      }
    };
  }
  delete_all();
  // ---------------------------- Test checked todos

  function testChecked() {
    let ch = document.querySelectorAll(".todo_checkbox");
    let td = document.querySelectorAll(".todo");
    ch.forEach(function (x) {
      x.addEventListener("change", clearChecked);
      x.checked ? x.parentElement.classList.add("done") : x.parentElement.classList.remove("done");
    });
    document.onchange = testChecked;
    function clearChecked() {
      for (var key in todoList) {
        for (var i = 0; i < ch.length; i++) {
          if (ch[i].checked) {
            if (
              ch[i].getAttribute("data-value") == td[key].getAttribute("data-value")
            ) {
              todoList[key].check = true;
              addtoLocalStorage();
            }
          } else {
            if (
              ch[i].getAttribute("data-value") == td[key].getAttribute("data-value")
            ) {
              todoList[key].check = false;
              addtoLocalStorage();
            }
          }
        }
      }
    }
  }
  // ---------------------------- Delete button
  function delete_btn() {
    let del_btn = document.querySelectorAll('.todo_delete')
    del_btn.forEach(x => x.addEventListener('click', todo_delete))
    function todo_delete() {
      if (confirm("Уверены?")) {
        todoList.splice(this.parentElement.getAttribute('data-value'), 1)
        addtoLocalStorage()
        out(todoList)
      }
    }
  }
  // ---------------------------- Edit button
  function edit_btn() {
    let ta = document.querySelectorAll(".todo_field");
    let edit_btn = document.querySelectorAll('.todo_edit')
    edit_btn.forEach(x => x.addEventListener('click', todo_edit))
    function todo_edit() {
      let x = ta[+this.parentElement.getAttribute('data-value')]
      this.parentElement.classList.add('active')
      x.setAttribute("contenteditable", "true")
      x.focus()
      x.addEventListener('focusout', edit_f)
      function edit_f() {
        todoList[this.parentElement.getAttribute('data-value')].todo = x.innerText
        this.parentElement.classList.remove('active')
        x.removeAttribute("contenteditable", "true")
        addtoLocalStorage()
      }
    }
  }
  // ---------------------------- Finder button

  document.querySelector(".btn-finder").onclick = finder_btn;
  function finder_btn() {
    testChecked()
    document.querySelector(".finder").classList.toggle("display");
  }
  let ch_done = document.querySelector('.check_done')
  let ch_inprogress = document.querySelector('.check_inprogress')
  ch_done.addEventListener('change', ch_change)
  ch_inprogress.addEventListener('change', ch_change)
  function ch_change() {
    if (ch_done.checked && !ch_inprogress.checked) {
      out(todoList.filter((x) => x.check == true))
      document.querySelector('.inp_finder').value = ''

    }
    else if (ch_inprogress.checked && !ch_done.checked) {
      out(todoList.filter((x) => x.check == false))
      document.querySelector('.inp_finder').value = ''
    }
    else {
      out(todoList)
    }
  }
  // ---------------------------- Main filter
  function main_filter() {
    document.querySelector('.inp_finder').oninput = function () {
      let val = this.innerText.toLowerCase().trim();
      let ta = document.querySelectorAll('.todo_field');
      if (val != "") {
        ta.forEach(function (x) {
          if (x.innerText.split('').map(x => x.toLowerCase()).join('').search(val) == -1) {
            x.parentElement.classList.add('hide');
          }
          else {
            x.parentElement.classList.remove('hide');
            let str = x.innerText;
            x.innerHTML = insertMark(str, x.innerText.split('').map(x => x.toLowerCase()).join('').search(val), val.length);
          }
        });
      }
      else {
        ta.forEach(function (x) {
          x.parentElement.classList.remove('hide');
          x.innerHTML = x.innerText;
        });
      }
    }
    function insertMark(str, pos, len) {
      return str.slice(0, pos) + '<mark>' + str.slice(pos, pos + len) + '</mark>' + str.slice(pos + len);
    }
  }
}
todoList();