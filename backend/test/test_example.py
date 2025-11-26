import pytest
def test_example():
    assert 1 + 1 == 2


def test_another_example():
    assert "coin" in "coin radar"

@pytest.fixture
def sample_data():
    return {"key": "value"}

def test_using_fixture(sample_data):
    assert sample_data["key"] == "value"


class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

@pytest.fixture
def student():
    return Student(name="Alice", age=20)

def test_student(student):
    assert student.age == 20, "Student age should be 20"
    assert student.name == "Alice", "Student name should be Alice"