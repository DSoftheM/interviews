```cs
using System;
using System.Collections;
using System.Collections.Generic;

public class ThreadSafeCircularBuffer<T> : IEnumerable<T>
{
    private readonly T[] _buffer;
    private int _head = -1;
    private int _count = 0;
    private readonly Lock _lock = new();

    public ThreadSafeCircularBuffer(int capacity)
    {
        if (capacity <= 0)
            throw new ArgumentOutOfRangeException(nameof(capacity));

        _buffer = new T[capacity];
    }

    public int Count
    {
        get { lock (_lock) { return _count; } }
    }

    public int Capacity => _buffer.Length;

    public void Add(T item)
    {
        lock (_lock)
        {
            _head = (_head + 1) % Capacity;
            _buffer[_head] = item;
            if (_count < Capacity)
                _count++;
        }
    }

    public T[] Snapshot()
    {
        lock (_lock)
        {
            var snapshot = new T[_count];
            for (int i = 0; i < _count; i++)
            {
                int index = (_head - i + Capacity) % Capacity;
                snapshot[i] = _buffer[index];
            }
            return snapshot;
        }
    }

    public IEnumerator<T> GetEnumerator()
    {
        foreach (var item in Snapshot())
            yield return item;
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
```