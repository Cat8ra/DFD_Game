class Collider{
    static intersect(a, b){
        let min_x, min_y, min_width, min_height, max_x, max_y;
        if (a.x < b.x){
            min_x = a.x;
            min_width = a.width;
            max_x = b.x;
        }
        else{
            min_x = b.x;
            min_width = b.width;
            max_x = a.x;
        }
        if (a.y < b.y){
            min_y = a.y;
            min_height = a.height;
            max_y = b.y;
        }
        else{
            min_y = b.y;
            min_height = b.height;
            max_y = a.y;
        }
        return (min_x + min_width > max_x) && (min_y + min_height > max_y);
    }
    static objIntersects(predator, victims){
        let pr = { x: predator.x, 
               y: predator.y, 
               width: predator.size, 
               height: predator.size
             };
        let flags = [];
        for (let victim of victims){
            if (victim === undefined){
                continue;
            }
            if (Collider.intersect(pr, { x: victim.x, y: victim.y, width: victim.size, height: victim.size})){
                flags.push(true);
            }
            else{
                flags.push(false);
            }
        }
        return flags;
    }
    static cellsUnderObject(obj){
        let x0 = Math.floor(obj.x);
        let y0 = Math.floor(obj.y);
        let x1 = Math.ceil(obj.x + obj.size);
        let y1 = Math.ceil(obj.y + obj.size);
        let ans = [];
        for (let i = x0; i < x1; i++){
            for (let j = y0; j < y1; j++){
                ans.push({x: i, y: j});
            }
        }
        return ans;
    }
}