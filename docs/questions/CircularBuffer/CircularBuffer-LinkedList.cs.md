```cs
using System.Collections;  
  
var buffer = new CircularBuffer<int>(3);  
  
buffer.Add(1);  
buffer.Add(2);  
buffer.Add(3);  
buffer.Add(4);  
  
Console.WriteLine(string.Join(", ", buffer)); // 4, 3, 2  
  
public class CircularBuffer<T> : IEnumerable<T>  
{  
    private readonly LinkedList<T> _list = [];  
  
    public CircularBuffer(int capacity)  
    {  
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(capacity);  
  
        Capacity = capacity;  
    }  
  
    public int Capacity { get; }  
  
    public int Count => _list.Count;  
  
    public void Add(T item)  
    {  
        if (_list.Count >= Capacity)  
            _list.RemoveLast();  
  
        _list.AddFirst(item);  
    }  
  
    public IEnumerator<T> GetEnumerator() => _list.GetEnumerator();  
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();  
}
```