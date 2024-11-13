'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight, Play, RefreshCw, Settings } from 'lucide-react'
import Editor from '@monaco-editor/react'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

export default function LeetCodeProblem() {
  const [code, setCode] = React.useState(`/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    
};`)
  const [output, setOutput] = React.useState("")

  const handleCodeChange = (value) => {
    if (value) setCode(value)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, problemId: '27' })
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your solution passed all test cases.",
        })
      } else {
        setOutput(result.output)
        toast({
          title: "Test cases failed",
          description: "Check the output for details.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting code:', error)
      toast({
        title: "Error",
        description: "There was an error submitting your code.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <DescriptionPanel />
      <div className="flex-1">
        <CodeEditor code={code} onCodeChange={handleCodeChange} onSubmit={handleSubmit} />
        <OutputPanel output={output} />
      </div>
    </div>
  )
}

function DescriptionPanel() {
  return (
    <Card className="w-full border-0 lg:w-[450px] overflow-auto">
      <div className="flex items-center gap-2 border-b p-4">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-sm font-medium">27. Remove Element</h1>
        <Badge variant="secondary">Easy</Badge>
      </div>
      <Tabs defaultValue="description" className="h-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="solution"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Solution
          </TabsTrigger>
          <TabsTrigger
            value="submissions"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Submissions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0 border-0 p-4">
          <div className="prose prose-sm dark:prose-invert">
            <p>Given an integer array <code>nums</code> and an integer <code>val</code>, remove all occurrences of <code>val</code> in <code>nums</code> <strong>in-place</strong>. The order of the elements may be changed. Then return <em>the number of elements in <code>nums</code> which are not equal to <code>val</code></em>.</p>
            <p>Consider the number of elements in <code>nums</code> which are not equal to <code>val</code> be <code>k</code>, to get accepted, you need to do the following things:</p>
            <ul>
              <li>Change the array <code>nums</code> such that the first <code>k</code> elements of <code>nums</code> contain the elements which are not equal to <code>val</code>. The remaining elements of <code>nums</code> are not important as well as the size of <code>nums</code>.</li>
              <li>Return <code>k</code>.</li>
            </ul>
            <p><strong>Custom Judge:</strong></p>
            <p>The judge will test your solution with the following code:</p>
            <pre><code>{`int[] nums = [...]; // Input array
int val = ...; // Value to remove
int[] expectedNums = [...]; // The expected answer with correct length.
                            // It is sorted with no values equaling val.

int k = removeElement(nums, val); // Calls your implementation

assert k == expectedNums.length;
sort(nums, 0, k); // Sort the first k elements of nums
for (int i = 0; i < actualLength; i++) {
    assert nums[i] == expectedNums[i];
}`}</code></pre>
            <p>If all assertions pass, then your solution will be <strong>accepted</strong>.</p>
            <p><strong>Example 1:</strong></p>
            <pre><code>{`Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).`}</code></pre>
            <p><strong>Example 2:</strong></p>
            <pre><code>{`Input: nums = [0,1,2,2,3,0,4,2], val = 2
Output: 5, nums = [0,1,4,0,3,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums containing 0, 0, 1, 3, and 4.
Note that the five elements can be returned in any order.
It does not matter what you leave beyond the returned k (hence they are underscores).`}</code></pre>
            <p><strong>Constraints:</strong></p>
            <ul>
              <li><code>0 &lt;= nums.length &lt;= 100</code></li>
              <li><code>0 &lt;= nums[i] &lt;= 50</code></li>
              <li><code>0 &lt;= val &lt;= 100</code></li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function CodeEditor({ code, onCodeChange, onSubmit }) {
  return (
    <div className="flex h-2/3 flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            JavaScript
          </Button>
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
          <Button size="sm" onClick={onSubmit}>Submit</Button>
        </div>
      </div>
      <div className="relative flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={onCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  )
}

function OutputPanel({ output }) {
  return (
    <div className="h-1/3 border-t">
      <Tabs defaultValue="output">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="output"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
          >
            Output
          </TabsTrigger>
        </TabsList>
        <TabsContent value="output" className="mt-0 border-0 p-4">
          <pre className="text-sm whitespace-pre-wrap">{output}</pre>
        </TabsContent>
      </Tabs>
    </div>
  )
}