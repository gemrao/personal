function printSum(n, sum){
    if(n<=0){
        console.log(sum)
        return 
    }
    sum=sum+ 2*n-1
    printSum(n-2,sum)

}
printSum(5,0)
printSum(8,0)