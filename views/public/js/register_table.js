

// getting edit button data stired in variable
  $(document).on("click", ".edit-button", async function () {
    // console.log("everything is working");
    var userId = $(this).attr("data-userId");
    $(".modal-body #FormuserId").val(userId);
    var username1 = $(this).attr("data-username");
    $(".modal-body #Formusername").val(username1);
    // console.log(username1)
    var email1 = $(this).attr("data-email");
    $(".modal-body #Formemail").val(email1);
    var age1 = $(this).attr("data-age");
    $(".modal-body #Formage").val(age1);
    var password1 = $(this).attr("data-password");
    $(".modal-body #Formpassword").val(password1);
  });






 $(document).on("click", ".edit-button", function () {
    // console.log("everything is working here too");
    var userId = $(this).attr("data-userId");
    // console.log(userId);
  document.getElementById("edit-api").href = `/editUser/${userId}`;
  $("#modal_form").attr("action",`/editUser/${userId}`);
 })


// <!-- upload file name from userdata -->

$(document).on('click', '.upload_button', function () {
  var buttonId = $(this).attr("data-buttonId");
//   console.log("this is the real button  id : " +buttonId);
  
 async function uploadFile(buttonId , event) {
  event.preventDefault();
  var fileInput = document.getElementById('fileInput_' + buttonId);
  var file = fileInput.files[0];

  var formData = new FormData();
 await formData.append('fileUpload', file); 
  $.ajax({
    url: '/uploads/' + buttonId,
    type: 'post',
    data: formData
  });}
});
  
// <!-- upload file name from userdata -->


//   <!-- ======================get filename data============= -->

  
    $(document).on('click', '.upload_button',async function () {
      var buttonId = $(this).attr("data-buttonId");
    //   console.log(buttonId);
  
    await $.ajax({
        method: 'get',
        url: '/uploads/' + buttonId,
        data: {},
        success: function (data, error) {
        //   console.log(data);
          if (data) {
            $("#fileNameSpan").text(data);
          } else {
            console.log(error);
          }
        }
      });
    });
  
  


//   <!-- ======================get INVOICE data============= -->
  
    $(document).on('click', '.pdf_link', function () {
        var linkId = $(this).attr("data-linkId");
        // console.log("Clicked on pdf_link with linkId:", linkId);

        $.ajax({
            type: 'GET',
            url: '/invoice/' + linkId,
            datatype: 'html',
            success: function (response) {
                // console.log("Success response:", response);
                window.location.href = '/invoice/' + linkId;
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });


//   <!-- ======================get INVOICE data============= -->

//   <!-- =============flash message==================== -->

  $(".flash").fadeOut(5000); 

//   <!-- =============flash message==================== -->
  
  