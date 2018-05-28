const {setup, test, xtest, group, end} = window.simplytest;

const fibonacci = n => {
    if (n < 1) throw new Error("Must be called with natural numbers over 0.");
    if (n <= 2) return 1;

    return fibonacci(n-1) + fibonacci(n-2);
};

setup();

group("math", () => {
    xtest("does 2 == 1?", t => {
        t.assertEq(2, 1);
    });
    
    test("2 + 2 == 4?", t => {
        t.assertEq(2 + 2, 4);
    });

    group("nested", () => {
        test("is 1 truthy?", t => {
            t.assert(1);
        });

        test("is 0 truthy?", t => {
            t.assertNot(1);
        });

        test("is 9 + 10 != 21?", t => {
            t.assertNotEq(9 + 10, 21);
        });
    });
});

test("fibonacci", t => {
    t.assertEq(fibonacci(1), 1);
    t.assertEq(fibonacci(2), 1);
    t.assertEq(fibonacci(3), 2);
    t.assertEq(fibonacci(4), 3);
});

end();
