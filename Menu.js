const targetEl = document.body;

const loadMenu = menuType => {
    fetch(menuType).
    then(res => {
        if (res.ok) {
            return res.text();
        }
    }).
    then(htmlMenu => {
        targetEl.innerHTML = htmlMenu;
    }); 
};