```cs
using System.Collections;  
  
var buffer = new CircularBuffer<int>(4);  
  
buffer.Add(1); // 1  
buffer.Add(2); // 2,1  
buffer.Add(3); // 3,2,1  
buffer.Add(4); // 4,3,2,1  
buffer.Add(5); // 5,4,3,2  
buffer.Add(6); // 6,5,4,3  
  
var array = buffer.ToArray();  
  
Console.WriteLine(string.Join(", ", buffer));  
Console.WriteLine(string.Join(", ", array));  
  
public class CircularBuffer<T> : IEnumerable<T>  
{  
    private readonly T[] _buffer;  
    private int _head = -1;  
    private int _count = 0;  
  
    public int Capacity => _buffer.Length;  
    public int Count => _count;  
  
    public CircularBuffer(int capacity)  
    {  
        if (capacity <= 0)  
            throw new ArgumentOutOfRangeException(nameof(capacity));  
  
        _buffer = new T[capacity];  
    }  
  
    public void Add(T item)  
    {  
        _head = (_head + 1) % Capacity;  
        _buffer[_head] = item;  
  
        if (_count < Capacity)  
            _count++;  
    }  
      
    public IEnumerator<T> GetEnumerator()  
    {  
        for (var i = 0; i < _count; i++)  
        {  
            var index = (_head - i + Capacity) % Capacity;  
            yield return _buffer[index];  
        }  
    }  
  
    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();  
}
```