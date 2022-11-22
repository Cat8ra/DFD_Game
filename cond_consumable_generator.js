class CondConsumableGenerator extends ConsumableGenerator{
  constructor(){
    super();
	this.max_cnt = 160;
    this.cond = false;
    this.next = undefined;
    
    this.map = [""]
  }
  callNext(){
      if (this.cond){
          this.next = this.gen(3);
          return true;
      }
      return false;
  }
  getNext(){
      this.cond = this.false;
      return this.next;
  }
  
  setNext(x, y){
      this.cond = true;
      this.nx = x;
      this.ny = y;
  }
  
  gen(n){
      switch (n){
        case 3:
          return new ConsumableStar(this.nx, this.ny);
          break;
      }
  }
  //TODO other consumables
}