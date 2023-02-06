class Items {
    constructor(stageId) {
        this.stageId = stageId;
        this.config = new ItemConfig();
        this.popup_S = new Popup();
    }

    show() {
        let stage     = document.getElementById(this.stageId);
        stage.appendChild(this.getItemTable());
    }

    getItemTable() {
        let container = document.createElement("div");
        let table     = document.createElement("table");
        let tr = document.createElement('tr');

        table.setAttribute('class', 'table table-striped')

        for (let i = 0; i < Object.keys(this.config.items_refine[0]).length; i++) {
            let key =  Object.keys(this.config.items_refine[0])[i];
            
            if (key == "type") {
                continue;
            }

            let th = document.createElement('th');
            th.innerHTML = key;
            tr.appendChild(th);
        }

        table.appendChild(tr);

        for (let i = 0; i < this.config.items_refine.length; i++) {
            let item = this.config.items_refine[i];
            tr = document.createElement('tr');
            for (let j = 0; j < Object.keys(this.config.items_refine[0]).length; j++) {
                let key =  Object.keys(this.config.items_refine[0])[j];
                let td = document.createElement('td');
                if (key == "src") {
                    tr.appendChild(this.getImagePicture(this.config.items_refine[i], 50));
                    continue;
                }

                if (key == "recipes") {
                    if (!item[key] || item[key].length == 0) {
                        continue;
                    }

                    let button = document.createElement('button');
                    button.innerHTML = "show " + item[key].length;
                    button.setAttribute('class', 'btn btn-light');

                    button.addEventListener('click', () => {
                        this.showRecipes(item);
                        window.scrollTo(0, 0);
                    });

                    tr.appendChild(button);
                    continue;
                }

                if (key == "color") {
                    let color = item[key];
                    let text_color = "black";

                    if (color.toLowerCase() == "blue" || color.toLowerCase() == "darkblue") {
                        text_color = "white";
                    }
                    if (!color) {
                        color = "white";
                    }

                    td.setAttribute("style", "background-color: " + color + "; color: " + text_color);
                    td.innerHTML = item.type;
                    tr.appendChild(td);
                    continue;
                }

                if (key == "type") {
                    continue;
                }
                
                td.innerHTML = item[key];
                tr.appendChild(td);

            }
            table.appendChild(tr);
        }

        container.appendChild(table);

        return container;
    }

    getImagePicture(item, size=100, customStyles="") {
        let img = document.createElement('img');
        
        img.src = this.config.items_refine_img_url + item.src;
        img.addEventListener('click', () => {
            window.open(this.config.items_refine_url + item.name, '_blank').focus();
        });

        img.setAttribute('class', 'img-thumbnail image');
        img.setAttribute('style', 'width: ' + size + 'px; ' + customStyles);
        
        return img;
    }
    
    getItemByName(itemName) {
        let item = {};

        for (let i = 0; i < this.config.items_refine.length; i++) {
            if (this.config.items_refine[i].name != itemName) {
                continue;
            }
            return this.config.items_refine[i];
        }
        return item;
    }
    
    showRecipes(item) {
        let container = document.createElement("div");
        let table     = document.createElement("table");

        table.setAttribute("class", "table table-striped");

        for (let i = 0; i < item.recipes.length; i++) {
            let recipe = item.recipes[i];
            let tr = document.createElement("tr");
            let output_amount = document.createElement("p");
            let seconds_per_unit = document.createElement("p");

            output_amount.innerHTML    = "= " + recipe.output_amount;
            seconds_per_unit.innerHTML = recipe.seconds_per_unit + " sec/unit";

            output_amount.setAttribute('style', "color: white;");
            output_amount.setAttribute('class', "text_bold");
            seconds_per_unit.setAttribute('style', "color: white;");

            for (let j = 0; j < recipe.ingredients.length; j++) {
                let td = document.createElement("td");
                td.innerHTML = recipe.ingredients[j][1] + "x " + recipe.ingredients[j][0];
                td.setAttribute("class", "text_bold");
                td.appendChild(this.getImagePicture(this.getItemByName(recipe.ingredients[j][0]), 75));
                tr.appendChild(td);
            }
            
            tr.appendChild(output_amount);
            tr.appendChild(seconds_per_unit);
            table.appendChild(tr);
        }
        
        container.appendChild(this.getImagePicture(this.getItemByName(item.name), 100, "margin: 20px; "));
        container.appendChild(table);

        this.popup_S.show(container);
    }
}