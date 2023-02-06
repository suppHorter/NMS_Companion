class Main {
    constructor() {
        this.navbar = new Navigation("navbar");
    }

    start() {
        this.navbar.show();
    }
}


let main = new Main();
main.start();