class ConsumableGenerator{
  constructor(){
	this.max_cnt = 160;
    this.cnt = this.max_cnt;
    this.next = undefined;
    
    this.map = [""]
  }
  callNext(){
      this.cnt--;
      if (this.cnt <= 0){
          this.next = this.gen(3);
          return true;
      }
      return false;
  }
  getNext(){
      this.cnt = this.max_cnt;
      return this.next;
  }
  
  gen(n){
      switch (n){
        case 3:
          return new ConsumableStar(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50));
          break;
      }
  }
  //TODO other consumables
}