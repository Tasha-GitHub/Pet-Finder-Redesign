// initialize the modal
$('.modal').modal();

// // Emptied the localStorage
// localStorage.clear();
//variabels for searchObj object
if (JSON.parse(localStorage.getItem("userID"))) {

  var storedUserID = JSON.parse(localStorage.getItem("userID"));

  // Sets the global current user id variable equal to the stored ID
  currentUser_id = storedUserID;

  // prepare currentURL string
  var currentURL = window.location.origin;

  //ajax call for given search inputs
  $.ajax({
    type: "GET",
    url: currentURL + "/users/" + currentUser_id,
  }).then(function (res) {
    favoritesQuery();
  })
} else {
  $("#favorites").html("<h2 class=\"white-text\"> Please login to view your favorite pets </h2>");

}

//$(document).ready(function(){
$("#favorites").on("click", ".removePet", function () {
  console.log("hi")
  var petId = this.id;
  console.log(petId);
  var deletePet = {
    id: petId,
    user: currentUser_id
  };

  // prepare currentURL string
  var currentURL = window.location.origin;

  $.ajax({
    type: "delete",
    url: currentURL + "/delete/favorite",
    data: deletePet
  }).then(function (data) {
    if (data) {
      alertify.success("pet deleted");
      location.reload();
    }
  });
});
//})

//favorites loaded function
function favoritesQuery() {

  // Here we get the location of the root page.
  var currentURL = window.location.origin;

  // The AJAX function uses the URL of our API to GET the data associated with it
  $.ajax({
      url: currentURL + "/users/" + currentUser_id,
      method: "GET"
    })
    .done(function (favorites) {

      // Here we are logging the URL so we have access to it for troubleshooting
      console.log("------------------------------------");
      console.log("URL: " + currentURL + "/api/favorites");
      console.log("------------------------------------");

      // Here we then log the NYTData to console, where it will show up as an object.
      console.log(favorites);
      console.log("------------------------------------");

      // show message if no pets are saved
      if (favorites.length === 0) {
        $("#favorites").append("<h2>You don't have any saved pets!</h2>");

      } else {
        // else show their saved pets
        for (var i = 0; i < favorites.length; i++) {

          // Create the materialize card and 
          var savedPet = $("<div>");
          savedPet.addClass("col s12 m4");
          savedPet.attr("id", favorites[i].PetId);
          //console.log(favorites[i].PetId);

          var card = $("<div>");
          card.addClass("card");
          savedPet.append(card);

          // add the pet image to the saved pet card
          var savedImage = $("<div>");
          savedImage.addClass("card-image");
          savedImage.append("<img class='faveImage responsive-img' src='" + favorites[i].Pet.pet_photo + "'>");
          savedImage.append("<span class='card-title'>" + favorites[i].Pet.pet_name + "</span>")
          card.append(savedImage);

          // have the bio slide up when link clicked
          var savedBio = $("<div>");
          savedBio.addClass("card-content");
          savedBio.append("<p>" + favorites[i].Pet.pet_description + "</p>");
          card.append(savedBio);
          // add an adopt option and a link to look at the pets bio again
          var savedAdopt = $("<div>");
          savedAdopt.addClass("card-action");
          savedAdopt.append("<button class='col s5 btn adopt' data-target='emailModal'><a href='#'>Adopt</a></button>");
          savedAdopt.append("<button class='col s5 offset-s2 btn removePet' id=" + favorites[i].PetId + ">Remove</button>");
          card.append(savedAdopt);

          // send it to the favorites section
          $("#favorites").append(savedPet);
        }
        // Loop through and display each of the pets

      }
    });
}