class DataFetch {
    constructor(stageId) {
        this.stageId = stageId;
        this.config = new ItemConfig()
        this.api_service = new Service_API();

        this.fetchedData = this.config.items_refine;
    }

    show() {
        let stage     = document.getElementById(this.stageId);
        // this.showNewItem(stage);
        this.showUpdateItems(stage);
    }

    showUpdateItems(stage) {
        let text      = document.createElement('textarea');
        let button    = document.createElement('button');
        let container = document.createElement('div');
        
        button.innerHTML = "update items";

        button.setAttribute("class", "btn btn-primary");
        text.setAttribute("class", "form-control");
        text.setAttribute("style", "height: 590px; width: 380%;");

        button.addEventListener("click", () => {
            for (let i = 0; i < this.fetchedData.length; i++) {
                this.getDataByItemName(this.fetchedData[i].name);
                
                this.fetchedData.sort(function(a, b) {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            }

            while(!this.fetchedData.length == this.config.items_refine.length) {
                continue;
            }

            text.value = JSON.stringify(JSON.parse(JSON.stringify(this.fetchedData)),null,2);
        });

        container.appendChild(text);
        container.appendChild(button);
        stage.appendChild(container);
    }

    showNewItem(stage) {
        let container = document.createElement('div');
        let item_name = document.createElement('input');
        let button    = document.createElement('button');
        let text      = document.createElement('text');

        button.innerHTML = "parse data";
        button.setAttribute("class", "btn btn-dark");

        button.addEventListener('click', () => {
            this.getDataByItemName(item_name.value);
        });

        container.appendChild(item_name);
        container.appendChild(button);
        container.appendChild(text);
        stage.appendChild(container);
    }

    getDataByItemName(siteName) {
        this.api_service.get(this.config.items_refine_url + siteName + "?action=raw", (resp) => {
            let getLineData = (prefix) => {
                let index_start = resp.indexOf(prefix) + prefix.length;
                let index_end = resp.indexOf("\n", index_start);

                if (index_start < 0) {
                    return -1;
                }
                return resp.substring(index_start, index_end);
            };

            let getBlockData = (prefix) => {
                let index_start = resp.indexOf(prefix) + prefix.length;
                let index_end = resp.indexOf("}}", index_start);

                if (index_start < 0) {
                    return -1;
                }
                
                return resp.substring(index_start + 1, index_end - 1).split("\n");
            };

            let item_data = {};

            item_data.amount_units = getLineData("value =").replace(' ', '');
            item_data.color        = getLineData("color =").replace(' ', '');
            item_data.type        = getLineData("type =").replace(' ', '');
            item_data.recipes = [];

            if (resp.indexOf("{{PoC-Refine") > 0) {
                let _recipes        = getBlockData("{{PoC-Refine");
                
                for (let i=0; i < _recipes.length; i++) {
                    let recipe = _recipes[i].split("%")[0];
                    recipe = recipe.split(";");
                    let _recipe = {};
                    _recipe.ingredients = [];

                    for (let j=0; j < recipe.length; j++) {
                        if (recipe[j].indexOf(",") > 0) {
                            recipe[j] = recipe[j].replace('| ', '');
                            recipe[j] = recipe[j].replace('|', '');
                            recipe[j] = recipe[j].replace(' ', '_');
                            
                            _recipe.ingredients.push(recipe[j].split(","));
                            continue;
                        }
                        _recipe.output_amount = recipe[j];
                        _recipe.seconds_per_unit = recipe[j+1];
                        j = recipe.length + 1;
                    }

                    item_data.recipes.push(_recipe);
                }
            }
        
            if (resp.indexOf("{{Craft|") > 0) {
                let _crafting        = getBlockData("{{Craft");
                let crafting = {};

                for (let i=0; i<_crafting.length; i++) {
                    crafting.ingredients = [];
                    let ingredients = _crafting[i].split("|")[0];
                    ingredients = ingredients.split(";");
                    for (let j=0; j < ingredients.length; j++) {
                        if (!ingredients[j]) {
                            continue;
                        }

                        let ingredientWithAmount = ingredients[j].split(",");

                        for (let x=0; x < ingredientWithAmount.length; x++) {
                            if (ingredientWithAmount[x][0] == " ") {
                                ingredientWithAmount[x] = ingredientWithAmount[x].substring(1);
                            }
    
                            if (ingredientWithAmount[x][ingredientWithAmount[x].length-1] == " ") {
                                ingredientWithAmount[x] = ingredientWithAmount[x].substring(0, ingredientWithAmount[x].length-1);
                            }
                            ingredientWithAmount[x] = ingredientWithAmount[x].replace(' ', '_');
                        }
                        
                        crafting.ingredients.push(ingredientWithAmount);
                        continue;
                    }
                    
                    crafting.output_amount = "1";
                    crafting.seconds_per_unit = "0.00";
                    item_data.recipes.push(crafting);
                    i = _crafting.length + 1;
                }
            }

            let found = false;

            for (let i = 0; i < this.fetchedData.length; i++) {
                let fetched_item = this.fetchedData[i];
                if (fetched_item.name != siteName) {
                    continue;
                }
                found = true;
                fetched_item.amount_units = item_data.amount_units;
                fetched_item.color        = item_data.color;
                fetched_item.type         = item_data.type;
                fetched_item.recipes      = item_data.recipes;
            }

            if (!found) {
                item_data.name = siteName;
                console.log(JSON.stringify(item_data));
            }
        });
    }
}