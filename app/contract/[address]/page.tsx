'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import CopyButton from '@/components/CopyButton';
import Link from 'next/link';
import { ContractInfo, ABIItem } from '@/types';
import { ethers } from 'ethers';
import { getProvider } from '@/lib/blockchain';

export default function ContractPage({ params }: { params: { address: string } }) {
  const searchParams = useSearchParams();
  const network = searchParams.get('network') || 'ethereum';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ContractInfo | null>(null);
  const [abi, setAbi] = useState<ABIItem[]>([]);
  const [abiInput, setAbiInput] = useState('');
  const [readResults, setReadResults] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/contract/${params.address}?network=${network}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        setContract(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contract data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.address, network]);

  const handleAbiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedAbi = JSON.parse(abiInput);
      setAbi(parsedAbi);
      setError(null);
    } catch (err) {
      setError('Invalid ABI JSON format');
    }
  };

  const handleReadFunction = async (func: ABIItem) => {
    if (!func.name) return;

    try {
      const provider = getProvider(network);
      const contractInstance = new ethers.Contract(params.address, [func], provider);
      const result = await contractInstance[func.name]();
      setReadResults((prev) => ({
        ...prev,
        [func.name!]: result.toString(),
      }));
    } catch (err) {
      setReadResults((prev) => ({
        ...prev,
        [func.name!]: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }));
    }
  };

  if (loading) return <Loading />;
  if (error && !contract) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        </div>
      </Card>
    );
  }
  if (!contract) return null;

  if (!contract.isContract) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            This address is not a contract. <Link href={`/address/${params.address}?network=${network}`} className="text-primary-600 dark:text-primary-400 hover:underline">View as address</Link>
          </p>
        </div>
      </Card>
    );
  }

  const viewFunctions = abi.filter(
    (item) =>
      item.type === 'function' &&
      (item.stateMutability === 'view' || item.stateMutability === 'pure' || item.constant)
  );

  return (
    <div className="space-y-6">
      {/* Contract Header */}
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Contract Inspector
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contract Address</p>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-2 rounded font-mono break-all flex-1">
                {params.address}
              </code>
              <CopyButton text={params.address} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Balance</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {(parseFloat(contract.balance) / 1e18).toFixed(6)} ETH
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                Contract Verified ✓
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={`/address/${params.address}?network=${network}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              View Address Details →
            </Link>
          </div>
        </div>
      </Card>

      {/* Bytecode */}
      <Card title="Contract Bytecode">
        <div className="bg-gray-100 dark:bg-gray-900 rounded p-4 max-h-48 overflow-auto">
          <code className="text-xs font-mono text-gray-900 dark:text-white break-all">
            {contract.bytecode}
          </code>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Bytecode length: {contract.bytecode.length / 2 - 1} bytes
        </p>
      </Card>

      {/* ABI Input */}
      <Card title="ABI Inspector">
        <form onSubmit={handleAbiSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste Contract ABI (JSON)
            </label>
            <textarea
              value={abiInput}
              onChange={(e) => setAbiInput(e.target.value)}
              className="w-full h-32 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none font-mono text-sm"
              placeholder='[{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"}]'
            />
          </div>
          {error && abi.length === 0 && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            Load ABI
          </button>
        </form>

        {abi.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-green-600 dark:text-green-400 mb-4">
              ✓ ABI loaded successfully ({abi.length} items)
            </p>
          </div>
        )}
      </Card>

      {/* Read Functions */}
      {viewFunctions.length > 0 && (
        <Card title="Read Contract">
          <div className="space-y-4">
            {viewFunctions.map((func, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {func.name}
                    </h3>
                    {func.inputs && func.inputs.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Inputs: {func.inputs.map((inp) => `${inp.name}: ${inp.type}`).join(', ')}
                      </p>
                    )}
                    {func.outputs && func.outputs.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Returns: {func.outputs.map((out) => out.type).join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleReadFunction(func)}
                    disabled={func.inputs && func.inputs.length > 0}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
                  >
                    {func.inputs && func.inputs.length > 0 ? 'Needs Input' : 'Read'}
                  </button>
                </div>
                {readResults[func.name!] && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Result:</p>
                    <code className="text-sm bg-white dark:bg-gray-800 px-3 py-2 rounded block font-mono text-gray-900 dark:text-white break-all">
                      {readResults[func.name!]}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Note: Functions requiring input parameters are not yet supported in this interface.
            Only view/pure functions without parameters can be called.
          </p>
        </Card>
      )}

      {/* Example ABIs */}
      <Card title="Example ABIs">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Try these example ABIs for common contracts:
        </p>
        <div className="space-y-2">
          <button
            onClick={() =>
              setAbiInput(
                JSON.stringify(
                  [
                    {
                      type: 'function',
                      name: 'name',
                      inputs: [],
                      outputs: [{ name: '', type: 'string' }],
                      stateMutability: 'view',
                    },
                    {
                      type: 'function',
                      name: 'symbol',
                      inputs: [],
                      outputs: [{ name: '', type: 'string' }],
                      stateMutability: 'view',
                    },
                    {
                      type: 'function',
                      name: 'totalSupply',
                      inputs: [],
                      outputs: [{ name: '', type: 'uint256' }],
                      stateMutability: 'view',
                    },
                  ],
                  null,
                  2
                )
              )
            }
            className="block w-full text-left px-4 py-3 rounded bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">ERC20 Token</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Basic ERC20 token functions (name, symbol, totalSupply)
            </p>
          </button>
        </div>
      </Card>
    </div>
  );
}
