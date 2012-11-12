import java.util.Scanner;


public class MultiplyExceptSelf {
	
	int [] arr=null;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int arrSize=0,i=0;
		int [] arr;
		int productOfAll=1;
		Scanner scanner = new Scanner(System.in);
		arrSize = Integer.parseInt(scanner.nextLine());
		arr = new int[arrSize];
		while(i<arrSize) {
			arr[i++] = Integer.parseInt(scanner.nextLine());
		}
		multiply(arr,1,0,arrSize);
		i=0;
		while (i<arrSize) {
			System.out.println(arr[i]);
			i++;
		}
	}
	
	public static int multiply(int[] a, int fwdProduct, int indx, int N) {
	    int revProduct = 1;
	    if (indx < N) {
	       revProduct = multiply(a, fwdProduct*a[indx], indx+1,N);
	       int cur = a[indx];
	       a[indx] = fwdProduct * revProduct;
	       revProduct *= cur;
	    }
	    return revProduct;
	}
}
