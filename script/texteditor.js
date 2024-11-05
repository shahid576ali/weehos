
document.querySelectorAll("textarea").forEach((textarea) => {
    ClassicEditor.create(textarea).catch((error) => {
        console.error(error);
    });
});

document
    .getElementById("wr_form")
    .addEventListener("submit", (event) => {
        editors.forEach((editor, index) => {
            document.querySelectorAll("textarea")[index].value =
                editor.getData();
        });
    });
