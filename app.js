$(document).ready(function () {
  var apiId = "429";

  //=============== SHOW THE LIST OF THE ENTIRE TASK(S) ============= //
  // Get the entire todo list
  var getTodoList = function () {
    $.ajax({
      type: "GET",
      url: `https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=${apiId}`,
      dataType: "json",
      success: function (response, textStatus) {
        console.log(response)
        $(".list").empty();
        //sort the list based on the id then iterate using map
        response.tasks
          .sort(function (a, b) {
            if (parseInt(a.id) > parseInt(b.id)) {
              return b.id;
            }
          })
          .map(function (el) {
            attachANewList(el);
            if(el.completed) {
              $('.list li i.complete').addClass('markComplete');
              $('.list li i.complete').parent().css('text-decoration', 'line-through');              
            }
          });

      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  // =========== ADD A NEW TODO TASK =================== //
  // function to iterate the list of objects from the data server and attach to the dom
  var attachANewList = function (el) {
    
    var newList = $("<li></li>").text(el.content);
    var markComplete = $(
      `<i class="fa-solid fa-check complete" data-id=${el.id} title="completed"></i>`
    );
    var removeTask = $( 
      `<i class="fa-solid fa-trash-can removeItem" data-id=${el.id} title="remove"></i>`
    );

    // allocate the corresponding id as the "ID" attribute of the list
    $(newList).attr("id", el.id);
    //attach the complete icons and trash icons
    
    $(newList).append(markComplete);
    
    $(newList).append(removeTask);
    //attach the list to the container
    $(".list").append(newList);
  };

  // button click event. Add a new todo task at the end of the list.
  $("#newTodoSave").click(function (e) {
    e.preventDefault();
    addNewTodoTask();
  });

  // add a new todo list "POST" request
  var addNewTodoTask = function () {
    $.ajax({
      type: "POST",
      url: `https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=${apiId}`,
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        task: {
          content: $("#newTodo").val(),
        },
      }),
      success: function (res, textStatus) {
        $("#newTodo").val("");
        getTodoList();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  // ============ MARK THE TASK COMPLETION STATUS ================= //
  // click the 'tick' icon to either complete or uncomplete the task
  $(document).on("click", ".complete", function () {
    if (this.nextElementSibling.checked) {
      this.nextElementSibling.checked = false;
      $(this).removeClass("markComplete");
      $(this).parent().css("text-decoration", "none");
      removeTaskCompletion($(this).data("id"));
    } else {
      this.nextElementSibling.checked = true;
      $(this).addClass("markComplete");
      $(this).parent().css("text-decoration", "line-through");
      markTaskCompletion($(this).data("id"));
    }
  });

  // mark the task as 'completed'
  var markTaskCompletion = function (id) {
    $.ajax({
      type: "PUT",
      url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_complete?api_key=${apiId}`,
      dataType: "json",
      success: function (res, textStatus) {
        console.log(res.task.completed);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };
  // un-mark the task completion status
  var removeTaskCompletion = function (id) {
    $.ajax({
      type: "PUT",
      url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_active?api_key=${apiId}`,
      dataType: "json",
      success: function (res, textStatus) {
        console.log(res.task.completed);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  // ========REMOVE A TASK=============================== //
  // click trash icon to remove the list item from the list
  $(document).on("click", ".removeItem", function () {
    removeTask($(this).data("id"));
  });
  // function to remove task
  var removeTask = function (id) {
    $.ajax({
      type: "DELETE",
      url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=${apiId}`,
      success: function (response, textStatus) {
        getTodoList();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      },
    });
  };

  getTodoList();


  // ============ FILTER TASKS BY COMPLETION STATUS =============== //

  $(document).on("click", ".all", function () {
    var listItems = $(".list li");
    $(listItems).show();
  });

  $(document).on("click", ".onlyCompleted", function () {
    var listItems = $(".list li .complete");
    listItems.map(function (el) {
      $(this).parent().show();
      if (!$(this).hasClass("markComplete")) {
        $(this).parent().hide();
      }
    });
  });

  $(document).on("click", ".onlyOutstanding", function () {
    var listItems = $(".list li .complete");
    listItems.map(function (el) {
      $(this).parent().show();
      if ($(this).hasClass("markComplete")) {
        $(this).parent().hide();
      }
    });
  });
});
