Задача 1
Реализовать (без использования LINQ) метод, возвращающий массив без дубликатов сохраняющий порядок элементов.

```cs
int[] Distinct(int[] src)
//[1,2,5,3,3,2] → [1,2,5,3]
```


Задача 2
Реализовать функцию FilterLast для библиотеки расширений которая возвращает все элементы исходной последовательности без последних N элементов. Исходную последовательность нельзя перечислять более одного раза и хранить целиком в памяти. Обратите внимание, что длина входящей последовательности заранее не известна (т.е. обращение source.Count() вызывает перечисление элементов последовательности)
Функция будет применяться аналогично LINQ методам расширения `(Select, Where …)`
Nullable reference types не используются 
Реализуйте поточный однопроходный алгоритм
Число n сильно меньше длины последовательности
Можно использовать дополнительная память для хранения небольшого числа элементов
```cs
public static IEnumerable<T> FilterLast<T>(this IEnumerable<T> source, int n)
```



Задача 3 
Дана следующая структура базы данных SQL
```sql
--Table Departments
create table D (
              Id int primary key,
              Name nvarchar(100),
)
 
--Table Employees
create table E (
              Id int primary key,
              DepartmentId int foreign key references Departments(Id),
              Name nvarchar(100),
              Salary float,
)
```
 
Необходимо:
a.           Написать запрос получения имени одного сотрудника, имеющего максимальную зарплату в компании, и название его отдела
b.          Получить список отделов, средняя зарплата в которых больше 1000$




# 4 
```cs
public static async Task Main()
{
  var sw = StopWatch.StartNew();
  
  var task1 = DoWorkAsync();
  var task2 = DoWorkAsync();
  await Task.WhenAll(task1, task2);
  
  // Что будет выведено в консоль? Почему?
  Console.WriteLine(sw.ElapsedMilliseconds);
}

public static  async Task DoWorkAsync()
{
  Thread.Sleep(1000);
  await Task.Delay(1000);
}
```