import java.util.Scanner;

public class CircularBuffer <T>{
	
	private T[] buffer;
	private int tail;
	private int head;
	int size;
	
	public CircularBuffer(int n) {
		buffer = (T[]) new Object[n];
		size = tail = head = 0;
	}
	
	public void add(T[] item){
		for (int i=0;i<item.length;i++) {
			if (head == tail && size > 0) {
				tail++;
				tail = tail % buffer.length;
			} else {
				size++;
			}
			buffer[head++] = item[i];
			head = head % buffer.length;
		}
	}
	
	public T[] remove (int n) {
		T[] removedItems = (T[]) new Object[n];
		if (n > size) {
			return removedItems;
		} else {
			for (int i=0;i<n;i++) {				
				removedItems[i] = buffer[tail];
				buffer[tail++] = (T) "";
				size--;
				tail = tail % buffer.length;
			}
			return removedItems;
		}
	}
	
	public void list() {
		int i=0;
		int tmpTail=tail;
		
		while(i < size) {
			System.out.println(buffer[tmpTail++]);
			i++;
			tmpTail = tmpTail % buffer.length;
		}		
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String[] cmds = new String[50000];
		String cmd;
		int i=0;
		String curCmd;
		int inputLength =0;
		int checkInputLength = 0;
		String [] inputsToCommand = null;
		Scanner scanner = new Scanner(System.in);
		String bufSizeStr = scanner.nextLine();
		boolean insideAddCommand = false;
		CircularBuffer<String> cirBuf = new CircularBuffer<String>(Integer.parseInt(bufSizeStr));		
		String[] input;
		mainWhile:
		while (scanner.hasNextLine()) {
			cmd = scanner.nextLine();
			if (cmd != "") {
				char cmdChar = cmd.charAt(0);
				if (!insideAddCommand) {
					inputLength = 0;
					if (cmd.length() != 1) {					
						switch (cmdChar) {
							case 'A':
							case 'a':
								insideAddCommand = true;
								inputsToCommand = new String[5000];
								if (cmd.charAt(1) != ' ') {
									System.out.println ("Wrong Command... Please re-enter.");
									insideAddCommand = false;
									break;
								}						
								input = cmd.split(" ");
								if (input.length != 2) {
									System.out.println ("Wrong Command... Please re-enter.");
									insideAddCommand = false;
									break;
								}
								int addItemsLength = Integer.parseInt(input[1]);
								checkInputLength = 0;
								inputLength = addItemsLength;
								inputsToCommand = new String[inputLength];
								break;
							case 'R':
							case 'r':
								if (cmd.charAt(1) != ' ') {
									System.out.println ("Wrong Command... Please re-enter.");
									break;
								}						
								input = cmd.split(" ");
								if (input.length != 2) {
									System.out.println ("Wrong Command... Please re-enter.");
									break;
								}
								int removeItemsLength = Integer.parseInt(input[1]);
								cirBuf.remove(removeItemsLength);
								break;
							default:
								System.out.println ("Wrong Command... Please re-enter.");						
								break;
						}
					} else {
						switch (cmdChar) {
							case 'L':
							case 'l':
								cirBuf.list();
								break;
							case 'Q':
							case 'q':
								scanner.close();
								break mainWhile;
							default:
								System.out.println ("Wrong Command... Please re-enter.");						
								break;
						}
					}
					
				} else {
					inputsToCommand[checkInputLength++] = cmd;
					if (checkInputLength == inputLength) {
						cirBuf.add(inputsToCommand);
						insideAddCommand = false;
					}
				}
			}
		}	
	}
}
