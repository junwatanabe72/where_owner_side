import React from 'react';
import { AlertTriangle, Info, Bell } from 'lucide-react';

interface Parcel {
  chiban: string;
  area: number;
  owner: string;
  previousOwner?: string;
  landType: string;
  isChanged: boolean;
  changeDate?: string;
}

interface RegistryTabProps {
  parcels?: Parcel[];
}

const RegistryTab: React.FC<RegistryTabProps> = ({ parcels = [] }) => {
  const defaultParcels: Parcel[] = [
    { chiban: '宇田川町83-1', area: 123.45, owner: '山田太郎', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-2', area: 234.56, owner: '渋谷区', landType: '宅地', isChanged: false },
    { chiban: '宇田川町83-3', area: 189.23, owner: '株式会社ABC商事', landType: '宅地', isChanged: false },
    { 
      chiban: '宇田川町83-4', 
      area: 156.78, 
      owner: '田中花子', 
      previousOwner: '佐藤次郎',
      landType: '宅地', 
      isChanged: true,
      changeDate: '2025-09-01'
    },
    { chiban: '宇田川町83-5', area: 201.34, owner: 'XYZ開発株式会社', landType: '宅地', isChanged: false },
  ];

  const displayParcels = parcels.length > 0 ? parcels : defaultParcels;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">隣地登記情報</h3>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">最新の変更を監視中</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地番
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地積 (㎡)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  所有者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地目
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayParcels.map((parcel, index) => (
                <tr key={parcel.chiban} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{parcel.chiban}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{parcel.area.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{parcel.owner}</div>
                      {parcel.isChanged && parcel.previousOwner && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="text-red-600">変更前: {parcel.previousOwner}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{parcel.landType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {parcel.isChanged ? (
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-xs font-medium text-yellow-700">
                          所有者変更 ({parcel.changeDate})
                        </span>
                      </div>
                    ) : parcel.chiban === '宇田川町83-2' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        対象地
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">変更なし</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p>登記情報は2025年9月3日時点のデータです。</p>
              <p className="mt-1">
                <span className="font-medium text-yellow-700">宇田川町83-4</span>
                の所有者が変更されました。詳細な変更内容は法務局で確認が必要です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryTab;