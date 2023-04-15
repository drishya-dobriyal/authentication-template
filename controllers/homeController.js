/* Hanler for Home */
module.exports.home = async function (req, res) {
  return res.render("home", {
    page_heading: "Project Name",
    title: "Project Name | Home",
  });
};
