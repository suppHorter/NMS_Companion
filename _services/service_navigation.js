class Navigation {
    constructor(stageId) {
        this.stageId = "navbar";
        this.stageIdChilds = "stage";
        this.refine       = new Refine(this.stageIdChilds);
        this.data_fetcher = new DataFetch(this.stageIdChilds);
        this.items        = new Items(this.stageIdChilds);
        this.routes = [{
            route: "Items",
            callback: () => {
                this.items.show();
            }
        }, {
            route: "Refining",
            callback: () => {
                this.refine.show();
            }
        }, {
            route: "Fetch Wiki-Data",
            callback: () => {
                this.data_fetcher.show();
            }
        }];
    }

    show() {
        let stage = document.getElementById(this.stageId);
        let container = document.createElement("div");
        
        stage.setAttribute('class', 'navbar navbar-dark bg-dark');
        stage.setAttribute('style', 'display: grid');
        container.setAttribute('class', 'container-fluid');

        stage.appendChild(container);

        for (let i = 0; i < this.routes.length; i++) {
            container.appendChild(this.getNavItem(this.routes[i]));   
        }

        this.routes[0].callback();
        
    }

    getNavItem(route) {
        let button = document.createElement('button');
        button.innerHTML = route.route;
        button.setAttribute('class', 'badge rounded-pill bg-primary m-1');
        button.addEventListener('click', () => {
            this.removeChilds();
            route.callback();
        });
        
        return button;
    }

    removeChilds() {
        let stage = document.getElementById(this.stageIdChilds);
        if (!stage) {
            return;
        }
        stage.innerHTML = '';
    }
}
