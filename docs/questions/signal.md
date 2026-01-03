https://github.com/longday/MidInterviewTest/tree/main
# 1. 
Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return -1.
```cs
Console.WriteLine(FirstUniqChar("leetcode")); // Output: 0 ('l')  
Console.WriteLine(FirstUniqChar("loveleetcode")); // Output: 2 ('v')  
Console.WriteLine(FirstUniqChar("aabb")); // Output: -1  
  
int FirstUniqChar(string s)  
{  
    var charCount = new Dictionary<char, int>();  
  
    foreach (var letter in s)  
    {  
        if (!charCount.TryAdd(letter, 1))  
            charCount[letter]++;  
    }  
  
    for (var i = 0; i < s.Length; i++)  
    {  
        var letter = s[i];  
        if (charCount[letter] == 1)  
            return i;  
    }  
  
    return -1;  
}
```

# 2.
Implement the Least Recently Used (LRU) cache class:
LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
int get(int key) Return the value of the key if the key exists, otherwise return -1.
void put(int key, int value) Update the value of the key if the key exists.
Otherwise, add the key-value pair to the cache. If the number of keys exceeds
the capacity from this operation, evict the least recently used key.

Extra:
The functions get and put must each run in O(1) average time complexity.

```cs
var lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4
```

# 3.

The task is to remove from the object tree all nodes
where the Alive property is false. However, if a node
has an Alive property that is true, all of its parents
and children should remain in the tree.

Extra:
Perform the task using recursive and iterative algorithms,
explain in which cases each one should be used, as well as
the advantages and disadvantages of each approach.

```cs
public record Node(int Id, int? ParentId, bool Alive, List<Node> Children);

public static class NodesCleaner
{
    public static void Clean(Node root)
    {
        throw new NotImplementedException();
    }
}

public class Tests
{
    [Fact]
    public void Test1()
    {
        var root = new Node(1, null, true, new List<Node>());
        var l11 = root.F();
        var l12 = root.T();
        l11.F().T();
        l12.F().T();
        root.T().F();
        root.F().T();
        //visualize tree
        //Print(root);
        NodesCleaner.Clean(root);
        var expected = """
            T1
            -F11
            --F111
            ---T1111
            -T12
            --F121
            ---T1211
            -T13
            --F131
            -F14
            --T141
            """.Trim();
        Assert.Equal(expected, Stringify(root).Trim());
    }

    [Fact]
    public void Test2()
    {
        var root = new Node(1, null, false, new List<Node>());
        root.F().F().F();
        root.F().T().F();
        //visualize tree
        //Print(root);
        NodesCleaner.Clean(root);
        var expected = """
            F1
            -F12
            --T121
            ---F1211
            """.Trim();
        Assert.Equal(expected, Stringify(root).Trim());
    }

    [Fact]
    public void Test3()
    {
        var root = new Node(1, null, false, new List<Node>());
        root.F().F().T();
        root.F().T().T();
        root.T().T().T();
        root.F().T().T();
        root.F().F().T();
        root.F().F().F();
        var l11 = root.F();
        l11.F();
        l11.T();
        l11.F().F();
        l11.F().T();
        l11.T().F();
        l11.T().T();

        var l12 = root.T();
        l12.F();
        l12.T();
        l12.F().F();
        l12.F().T();
        l12.T().F();
        l12.T().T();

        //visualize tree
        //Print(root);
        NodesCleaner.Clean(root);
        var expected = """
            F1
            -F11
            --F111
            ---T1111
            -F12
            --T121
            ---T1211
            -T13
            --T131
            ---T1311
            -F14
            --T141
            ---T1411
            -F15
            --F151
            ---T1511
            -F17
            --T172
            --F174
            ---T1741
            --T175
            ---F1751
            --T176
            ---T1761
            -T18
            --F181
            --T182
            --F183
            ---F1831
            --F184
            ---T1841
            --T185
            ---F1851
            --T186
            ---T1861
            """.Trim();

        Assert.Equal(expected, Stringify(root).Trim());
    }

    private readonly ITestOutputHelper _output;

    public Tests(ITestOutputHelper output)
    {
        _output = output;
    }

    private string Stringify(Node node, int level = 0)
    {
        return $"{new string('-', level)}{node.Alive.ToString()[0]}{node.Id}"
            + Environment.NewLine
            + string.Join("", node.Children.Select(child => Stringify(child, level + 1)));
        /*return $"{new string(' ', level * 2)}Id:{node.Id} pId{(node.ParentId.HasValue ? node.ParentId : "R")}:{node.Alive}"
            + Environment.NewLine
            + string.Join("", node.Children.Select(child => Stringify(child, level + 1)));*/
    }

    private void Print(Node node)
    {
        _output.WriteLine(Stringify(node));
    }
}

public static class NodeUtils
{
    public static Node T(this Node parent) => CreateChild(parent, true);

    public static Node F(this Node parent) => CreateChild(parent, false);

    public static Node CreateChild(this Node parent, bool alive)
    {
        var child = new Node(
            (parent.Children.Count > 0 ? parent.Children[^1].Id : parent.Id * 10) + 1,
            parent.Id,
            alive,
            new List<Node>()
        );

        parent.Children.Add(child);
        return child;
    }
}
```