export const STANDARD_PATTERNS = [
    {
        name: "Strategy",
        def: `classDiagram
class Context {
    -Strategy strategy
    +Context(Strategy)
    +executeStrategy()
}
class Strategy {
    <<interface>>
    +algorithmInterface()
}
class ConcreteStrategyA {
    +algorithmInterface()
}
class ConcreteStrategyB {
    +algorithmInterface()
}
Context o--> Strategy
Strategy <|.. ConcreteStrategyA
Strategy <|.. ConcreteStrategyB`
    },
    {
        name: "Observer",
        def: `classDiagram
class Subject {
    -observers
    +attach(Observer)
    +detach(Observer)
    +notify()
}
class Observer {
    <<interface>>
    +update()
}
class ConcreteSubject {
    -state
    +getState()
    +setState()
}
class ConcreteObserver {
    -subject
    -observerState
    +update()
}
Subject --> Observer
Subject <|-- ConcreteSubject
Observer <|.. ConcreteObserver
ConcreteObserver --> ConcreteSubject`
    },
    {
        name: "Singleton",
        def: `classDiagram
class Singleton {
    -static Singleton instance
    -Singleton()
    +static getInstance()
}
note for Singleton "return instance"`
    },
    {
        name: "Factory Method",
        def: `classDiagram
class Creator {
    +factoryMethod()
    +anOperation()
}
class ConcreteCreator {
    +factoryMethod()
}
class Product {
    <<interface>>
}
class ConcreteProduct {
}
Creator <|-- ConcreteCreator
Product <|.. ConcreteProduct
ConcreteCreator ..> ConcreteProduct`
    },
    {
        name: "Composite",
        def: `classDiagram
class Component {
    +operation()
    +add(Component)
    +remove(Component)
    +getChild(int)
}
class Leaf {
    +operation()
}
class Composite {
    +operation()
    +add(Component)
    +remove(Component)
    +getChild(int)
}
Component <|-- Leaf
Component <|-- Composite
Composite o--> Component`
    }
];