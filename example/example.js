const {setup, test, xtest, group, end} = window.simplytest;

const fibonacci = n => {
    if (n < 1) throw new Error("Must be called with natural numbers over 0.");
    if (n <= 2) return 1;

    return fibonacci(n-1) + fibonacci(n-2);
};

const badFunction = () => {
    throw new Error("oh no something wrong");
};

setup();

group("math", () => {
    xtest("does 2 == 1?", t => {
        t.identical(2, 1);
    });

    test("2 + 2 == 4?", t => {
        t.identical(2 + 2, 4);
    });

    group("nested", () => {
        test("is 1 truthy?", t => {
            t.assert(1);
        });

        test("is 0 truthy?", t => {
            t.assert(0);
        });

        test("is 9 + 10 != 21?", t => {
            t.nonidentical(9 + 10, 21);
        });
    });
});

test("this function should throw an error", t => {
    t.throws(badFunction, "oh yesn't");
});

group("fibonacci", () => {
    test("fibonacci(1) == 1", t => t.identical(fibonacci(1), 1));
    test("fibonacci(2) == 1", t => t.identical(fibonacci(2), 1));
    test("fibonacci(3) == 2", t => t.identical(fibonacci(3), 2));
    test("fibonacci(4) == 3", t => t.identical(fibonacci(4), 3));
    test("fibonacci(0) should throw", t => t.throws(() => fibonacci(0)));
});

end();
